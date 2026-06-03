from PIL import Image
import sys

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Change all black (also shades of black) to transparent
        # We calculate the luminance to create an alpha mask so the white lines have soft edges
        r, g, b, a = item
        luminance = int(0.299*r + 0.587*g + 0.114*b)
        
        # The brighter the pixel, the more opaque it is
        # Solid white will be fully opaque white, black will be fully transparent
        newData.append((255, 255, 255, luminance))
        
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Successfully created transparent icon at {output_path}")

if __name__ == "__main__":
    remove_black_background(sys.argv[1], sys.argv[2])
