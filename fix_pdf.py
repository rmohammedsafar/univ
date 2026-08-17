import os

with open('src/data/initialData.js', 'rb') as f:
    content = f.read()

# Find where the corruption starts: \r\n\x00e\x00x\x00p\x00o\x00r\x00t
idx = content.find(b'\r\n\x00e\x00x\x00p\x00o\x00r\x00t')
if idx == -1:
    idx = content.find(b'\n\xff\xfe')
    if idx == -1:
        idx = content.find(b'\r\n\xff\xfe')
    if idx == -1:
        # try to find the last valid character '};' before the bad append
        idx = content.find(b'};\r\n\r\ne x p o r t') 
        if idx == -1:
             idx = content.find(b'};\r\n\x00\r\n\x00')

if idx != -1:
    content = content[:idx + 2]
else:
    # Fallback: decode and find the last '};' that is part of INITIAL_ABOUT_US
    text = content.decode('utf-8', errors='ignore')
    split_idx = text.rfind('};')
    if split_idx != -1:
        content = text[:split_idx + 2].encode('utf-8')

valid_str = content.decode('utf-8', errors='ignore')

valid_str += '''

export const INITIAL_PDF_CONFIG = {
  universityName: "UNIVERSITY OF EAST FLORIDA",
  subHeader: "OFFICIAL PROGRAM SYLLABUS & BROCHURE",
  footerText: "This document is an officially verified syllabus from University of East Florida.",
  primaryColor: "#d4af37"
};
'''

with open('src/data/initialData.js', 'w', encoding='utf-8') as f:
    f.write(valid_str)
