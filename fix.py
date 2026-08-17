with open('src/data/initialData.js', 'rb') as f:
    content = f.read()

idx = content.find(b'};\r\ne\x00x\x00p\x00o\x00r\x00t')
if idx == -1:
    idx = content.find(b'};\n\xff\xfe')
    if idx == -1:
        idx = content.find(b'};\r\n\xff\xfe')
    if idx == -1:
        idx = content.find(b'};\r\ne x p o r t') # fallback based on view_file representation

# If we couldn't find the exact split with binary search, we'll try something simpler
if idx != -1:
    content = content[:idx + 2]
else:
    # Just decode ignore, then find the last '};'
    text = content.decode('utf-8', errors='ignore')
    split_idx = text.rfind('};')
    if split_idx != -1:
        content = text[:split_idx + 2].encode('utf-8')

valid_str = content.decode('utf-8', errors='ignore')

valid_str += '''

export const INITIAL_ABOUT_US = {
  quote: "“Diversity is the one true thing we all have in common. Celebrate it every day with UEF.”",
  title: "Who we are",
  description: "The University of East Florida (UEF) is a premier digital institution dedicated to fostering academic excellence and building meaningful relationships among international scholars. Founded in 2026, we bridge geographical gaps through rigorous, 100% online theoretical programs. At UEF, we celebrate intellectual diversity and create opportunities for students to connect, grow, and thrive globally in a completely asynchronous environment.",
  logoUrl: "/assets/logo.jpg",
  image1: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
  image2: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
};
'''

with open('src/data/initialData.js', 'w', encoding='utf-8') as f:
    f.write(valid_str)
