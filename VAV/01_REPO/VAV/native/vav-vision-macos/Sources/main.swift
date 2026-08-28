import Foundation
import Vision
import AppKit
import CoreImage
import CoreVideo

struct NormalizedRect: Codable {
    let x: Double
    let y: Double
    let width: Double
    let height: Double
}

struct FaceResult: Codable {
    let bbox: NormalizedRect
    let confidence: Float
    let leftEye: [CGPointCodable]
    let rightEye: [CGPointCodable]
    let outerLips: [CGPointCodable]
}

struct CGPointCodable: Codable {
    let x: Double
    let y: Double
}

struct TextResult: Codable {
    let text: String
    let confidence: Float
    let bbox: NormalizedRect
}

struct SaliencyResult: Codable {
    let kind: String
    let regions: [NormalizedRect]
}

struct AnalysisResult: Codable {
    let schemaVersion: Int
    let input: String
    let coordinateSystem: String
    let faces: [FaceResult]
    let text: [TextResult]
    let saliency: [SaliencyResult]
    let personMask: String?
    let warnings: [String]
}

func vavRect(_ rect: CGRect) -> NormalizedRect {
    // Vision legacy observations use normalized bottom-left coordinates.
    NormalizedRect(
        x: Double(rect.origin.x),
        y: Double(1.0 - rect.origin.y - rect.size.height),
        width: Double(rect.size.width),
        height: Double(rect.size.height)
    )
}

func points(_ region: VNFaceLandmarkRegion2D?) -> [CGPointCodable] {
    guard let region else { return [] }
    return region.normalizedPoints.map { CGPointCodable(x: Double($0.x), y: Double(1.0 - $0.y)) }
}

func loadCGImage(_ url: URL) throws -> CGImage {
    guard let image = NSImage(contentsOf: url) else {
        throw NSError(domain: "VAVVision", code: 10, userInfo: [NSLocalizedDescriptionKey: "No se pudo abrir la imagen."])
    }
    var rect = CGRect(origin: .zero, size: image.size)
    guard let cg = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
        throw NSError(domain: "VAVVision", code: 11, userInfo: [NSLocalizedDescriptionKey: "No se pudo convertir la imagen a CGImage."])
    }
    return cg
}

func writeMask(_ pixelBuffer: CVPixelBuffer, to url: URL) throws {
    let ci = CIImage(cvPixelBuffer: pixelBuffer)
    let context = CIContext(options: [.useSoftwareRenderer: false])
    guard let cg = context.createCGImage(ci, from: ci.extent) else {
        throw NSError(domain: "VAVVision", code: 12, userInfo: [NSLocalizedDescriptionKey: "No se pudo convertir la máscara."])
    }
    let rep = NSBitmapImageRep(cgImage: cg)
    guard let data = rep.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "VAVVision", code: 13, userInfo: [NSLocalizedDescriptionKey: "No se pudo codificar la máscara PNG."])
    }
    try data.write(to: url, options: .atomic)
}

func jsonPrint<T: Encodable>(_ value: T) throws {
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    let data = try encoder.encode(value)
    FileHandle.standardOutput.write(data)
    FileHandle.standardOutput.write(Data("\n".utf8))
}

func capabilities() throws {
    let object: [String: Any] = [
        "schemaVersion": 1,
        "provider": "vav-vision-macos",
        "implemented": [
            "person-segmentation",
            "face-detection",
            "face-landmarks",
            "ocr",
            "saliency-attention",
            "saliency-objectness"
        ],
        "planned": [
            "person-instance-mask",
            "foreground-instance-mask",
            "body-pose-2d",
            "body-pose-3d",
            "hand-pose",
            "optical-flow",
            "object-tracking",
            "rectangle-tracking",
            "homography",
            "image-feature-print",
            "image-aesthetics",
            "coreml-custom",
            "depth"
        ],
        "coordinateSystem": "VAV normalized top-left"
    ]
    let data = try JSONSerialization.data(withJSONObject: object, options: [.prettyPrinted, .sortedKeys])
    FileHandle.standardOutput.write(data)
    FileHandle.standardOutput.write(Data("\n".utf8))
}

func analyzeImage(input: String, output: String) throws {
    let inputURL = URL(fileURLWithPath: input)
    let outputURL = URL(fileURLWithPath: output, isDirectory: true)
    try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)
    let image = try loadCGImage(inputURL)
    let handler = VNImageRequestHandler(cgImage: image, options: [:])

    let faceRequest = VNDetectFaceLandmarksRequest()
    let textRequest = VNRecognizeTextRequest()
    textRequest.recognitionLevel = .accurate
    textRequest.usesLanguageCorrection = true
    let attentionRequest = VNGenerateAttentionBasedSaliencyImageRequest()
    let objectnessRequest = VNGenerateObjectnessBasedSaliencyImageRequest()

    var requests: [VNRequest] = [faceRequest, textRequest, attentionRequest, objectnessRequest]
    var personRequest: VNGeneratePersonSegmentationRequest? = nil
    var warnings: [String] = []

    if #available(macOS 12.0, *) {
        let request = VNGeneratePersonSegmentationRequest()
        request.qualityLevel = .accurate
        request.outputPixelFormat = kCVPixelFormatType_OneComponent8
        personRequest = request
        requests.append(request)
    } else {
        warnings.append("Person segmentation requiere una versión de macOS compatible.")
    }

    try handler.perform(requests)

    let faces: [FaceResult] = (faceRequest.results ?? []).compactMap { observation in
        guard let face = observation as? VNFaceObservation else { return nil }
        return FaceResult(
            bbox: vavRect(face.boundingBox),
            confidence: face.confidence,
            leftEye: points(face.landmarks?.leftEye),
            rightEye: points(face.landmarks?.rightEye),
            outerLips: points(face.landmarks?.outerLips)
        )
    }

    let texts: [TextResult] = (textRequest.results ?? []).compactMap { observation in
        guard let recognized = observation as? VNRecognizedTextObservation,
              let top = recognized.topCandidates(1).first else { return nil }
        return TextResult(text: top.string, confidence: top.confidence, bbox: vavRect(recognized.boundingBox))
    }

    func saliency(_ request: VNImageBasedRequest, kind: String) -> SaliencyResult {
        let observation: VNSaliencyImageObservation?
        if let r = request as? VNGenerateAttentionBasedSaliencyImageRequest {
            observation = r.results?.first as? VNSaliencyImageObservation
        } else if let r = request as? VNGenerateObjectnessBasedSaliencyImageRequest {
            observation = r.results?.first as? VNSaliencyImageObservation
        } else {
            observation = nil
        }
        let regions = (observation?.salientObjects ?? []).map { vavRect($0.boundingBox) }
        return SaliencyResult(kind: kind, regions: regions)
    }

    var maskPath: String? = nil
    if #available(macOS 12.0, *), let result = personRequest?.results?.first as? VNPixelBufferObservation {
        let maskURL = outputURL.appendingPathComponent("person-mask.png")
        do {
            try writeMask(result.pixelBuffer, to: maskURL)
            maskPath = maskURL.path
        } catch {
            warnings.append("Person mask detectada pero no pudo escribirse: \(error.localizedDescription)")
        }
    }

    let result = AnalysisResult(
        schemaVersion: 1,
        input: inputURL.path,
        coordinateSystem: "normalized-top-left",
        faces: faces,
        text: texts,
        saliency: [saliency(attentionRequest, kind: "attention"), saliency(objectnessRequest, kind: "objectness")],
        personMask: maskPath,
        warnings: warnings
    )

    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    let data = try encoder.encode(result)
    try data.write(to: outputURL.appendingPathComponent("visual-analysis.json"), options: .atomic)
    FileHandle.standardOutput.write(data)
    FileHandle.standardOutput.write(Data("\n".utf8))
}

let args = Array(CommandLine.arguments.dropFirst())
do {
    guard let command = args.first else {
        throw NSError(domain: "VAVVision", code: 2, userInfo: [NSLocalizedDescriptionKey: "Uso: vav-vision-macos capabilities | analyze-image --input <image> --output <dir>"])
    }
    if command == "capabilities" {
        try capabilities()
    } else if command == "analyze-image" {
        guard let inputIndex = args.firstIndex(of: "--input"), inputIndex + 1 < args.count,
              let outputIndex = args.firstIndex(of: "--output"), outputIndex + 1 < args.count else {
            throw NSError(domain: "VAVVision", code: 3, userInfo: [NSLocalizedDescriptionKey: "Faltan --input y --output."])
        }
        try analyzeImage(input: args[inputIndex + 1], output: args[outputIndex + 1])
    } else {
        throw NSError(domain: "VAVVision", code: 4, userInfo: [NSLocalizedDescriptionKey: "Comando desconocido: \(command)"])
    }
} catch {
    FileHandle.standardError.write(Data((error.localizedDescription + "\n").utf8))
    exit(2)
}
