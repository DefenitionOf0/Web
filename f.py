from matplotlib import patches
from matplotlib.path import Path
import matplotlib.pyplot as plt
from fontTools.ttLib import TTFont
import numpy as np


def render_text(font_path, text, height, tolerance=0.1, fixed_radius=None):
    """
    Renders a text phrase using glyphs from the specified font.
    """
    font = TTFont(font_path)
    glyph_set = font.getGlyphSet()

    # Load font metrics
    cmap = font.getBestCmap()
    scale_factor = height / font["head"].unitsPerEm  # Scale based on the font's units per em

    # Initialize matplotlib plot
    fig, ax = plt.subplots()
    ax.set_aspect('equal', adjustable='datalim')

    # Start position for drawing
    current_x = 0
    current_y = 0

    for char in text:
        glyph_name = cmap.get(ord(char))
        if glyph_name is None:
            current_x += height * 0.5  # Advance for undefined characters (e.g., spaces)
            continue

        glyph = glyph_set[glyph_name]

        # Create pen for glyph rendering
        pen = OptimizedGlyphPen(glyph_set, tolerance=tolerance, scale_factor=scale_factor)
        glyph.draw(pen)

        # Prepare path data for rendering
        path_data = []
        for command, *args in pen.path:
            if command == 'moveTo':
                x, y = args[0]
                path_data.append((Path.MOVETO, (current_x + x, current_y + y)))
            elif command == 'lineTo':
                x, y = args[0]
                path_data.append((Path.LINETO, (current_x + x, current_y + y)))
            elif command == 'curveTo':
                # Curve with control points
                control1, control2, end = args
                path_data.append((Path.CURVE4, (current_x + control1[0], current_y + control1[1])))
                path_data.append((Path.CURVE4, (current_x + control2[0], current_y + control2[1])))
                path_data.append((Path.CURVE4, (current_x + end[0], current_y + end[1])))
            elif command == 'closePath':
                path_data.append((Path.CLOSEPOLY, (current_x, current_y)))

        # Convert path_data to a Path object and add to plot
        if path_data:
            codes, vertices = zip(*path_data)
            path = Path(vertices, codes)
            patch = patches.PathPatch(path, facecolor='none', edgecolor='black', lw=1)
            ax.add_patch(patch)

        # Advance position by glyph width
        current_x += glyph.width * scale_factor

    # Display the plot
    ax.autoscale()
    plt.show()


class OptimizedGlyphPen:
    """
    A pen implementation to trace and optimize glyph paths.
    """
    def __init__(self, glyph_set, tolerance, scale_factor):
        self.glyph_set = glyph_set
        self.path = []
        self.scale_factor = scale_factor
        self.tolerance = tolerance

    def _scale(self, point):
        return point[0] * self.scale_factor, point[1] * self.scale_factor

    def moveTo(self, p0):
        self.path.append(('moveTo', self._scale(p0)))

    def lineTo(self, p1):
        self.path.append(('lineTo', self._scale(p1)))

    def curveTo(self, *points):
        scaled_points = [self._scale(p) for p in points]
        self.path.append(('curveTo', *scaled_points))

    def closePath(self):
        self.path.append(('closePath',))


# Example usage
font_path = "HandWriting_1.otf"  # Replace with the path to your font file
text = "HW"
render_text(font_path, text, height=200, tolerance=0.1)