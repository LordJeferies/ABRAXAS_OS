---
name: abraxas-baseline
description: Verifies ABRAXAS Git, filesystem, VAV and toolchain truth before consequential development.
---

Verify canonical Git root, branch, local HEAD, `origin/main`, working tree,
nested Git, relevant source/runtime paths and required toolchain.
Stop if the baseline differs from expectation until the difference is explained.
