import sys

input_path = "src/app-bundled-from-user-index.jsx"

with open(input_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Split at line 10117 (0-indexed: 10116) - just before "const root = ReactDOM.createRoot"
# Lines 0..10116 = ~498KB < 500KB
# Lines 10117..end = ~399KB < 500KB
split_line = 10117

# Part 1: everything except the last render + audiobook
out1_lines = lines[:split_line]
# Part 2: render call + everything after
out2_lines = lines[split_line:]

with open("src/app-bundle-part1.jsx", "w", encoding="utf-8") as f:
    f.writelines(out1_lines)

with open("src/app-bundle-part2.jsx", "w", encoding="utf-8") as f:
    f.writelines(out2_lines)

print(f"Part 1: {len(out1_lines)} lines")
print(f"Part 2: {len(out2_lines)} lines")

import os
size1 = os.path.getsize("src/app-bundle-part1.jsx")
size2 = os.path.getsize("src/app-bundle-part2.jsx")
print(f"Part 1 size: {size1} bytes ({size1/1024:.1f} KB)")
print(f"Part 2 size: {size2} bytes ({size2/1024:.1f} KB)")