from PIL import Image

def recolor_image_with_transparency(input_path, output_path, new_color):
    """
    Recolors an image by applying a new RGB color while preserving the alpha channel.
    
    Parameters:
        input_path (str): Path to input image (PNG with transparency).
        output_path (str): Path to save recolored image.
        new_color (tuple): New RGB color, e.g., (255, 0, 0) for red.
    """
    # Open image with alpha channel
    image = Image.open(input_path).convert("RGBA")
    pixels = image.load()

    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a > 0:
                # Replace RGB while keeping original alpha
                pixels[x, y] = (*new_color, a)

    image.save(output_path, "PNG")
    print(f"Saved recolored image to {output_path}")

# Example usage:
recolor_image_with_transparency("black_queen.png", "black_queen.png", (0, 0, 0))  # Blue tint
