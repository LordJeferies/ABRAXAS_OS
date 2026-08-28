# Source Time ↔ Timeline Time

This is what allows every workflow order.

## Source-anchored truth
Transcript words should keep immutable source coordinates.

```text
SOURCE VIDEO
W001  43.200s–43.520s
W002  43.520s–43.900s
```

## Edit map
A cutting tool exports:

```json
{
  "clips": [
    {
      "sourceStartUs": 43000000,
      "sourceEndUs": 59000000,
      "timelineStartUs": 0
    }
  ]
}
```

VAV projects words, content candidates and motion spans onto the output timeline.

## Consequence
You can transcribe a one-hour master once.
Later cut it into 20 clips without retranscribing the same material 20 times,
provided the edit manifest maps output clips back to source.

Boundary repair/alignment can run only around edit edges.
