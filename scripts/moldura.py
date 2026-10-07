"""Coloca os screenshots de celular numa moldura de aparelho.

Uso: python scripts/moldura.py
Lê docs/screenshots/mobile-*.png e grava docs/screenshots/celular-*.png
e docs/screenshots/celulares.png (as quatro telas lado a lado). Dependência: Pillow.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

DIR = Path(__file__).resolve().parent.parent / "docs" / "screenshots"
TELAS = ["linha", "filmes", "ranking", "perfil"]

BORDA = 26          # espessura da moldura
RAIO_TELA = 96      # canto da tela
AA = 3              # supersampling das formas


def rounded(size, radius, fill):
    w, h = size
    big = Image.new("L", (w * AA, h * AA), 0)
    ImageDraw.Draw(big).rounded_rectangle((0, 0, w * AA - 1, h * AA - 1), radius * AA, fill=255)
    mask = big.resize(size, Image.LANCZOS)
    layer = Image.new("RGBA", size, fill)
    layer.putalpha(mask)
    return layer


def com_barra_de_status(tela):
    """Acrescenta a barra de status no topo, para a ilha não cobrir o app."""
    alto = 104
    sw, sh = tela.size
    fundo = tela.getpixel((4, 4))
    nova = Image.new("RGBA", (sw, sh + alto), fundo)
    nova.paste(tela, (0, alto))
    d = ImageDraw.Draw(nova)
    try:
        fonte = ImageFont.truetype("arialbd.ttf", 32)
    except OSError:
        fonte = ImageFont.load_default()
    branco = (255, 255, 255, 255)
    d.text((96, 44), "9:41", font=fonte, fill=branco)
    # sinal
    for i in range(4):
        d.rounded_rectangle((sw - 220 + i * 13, 72 - 7 * (i + 1), sw - 212 + i * 13, 74), 2, fill=branco)
    # bateria
    d.rounded_rectangle((sw - 144, 48, sw - 90, 74), 7, outline=(255, 255, 255, 140), width=2)
    d.rounded_rectangle((sw - 140, 52, sw - 100, 70), 4, fill=branco)
    return nova


def emoldurar(tela):
    tela = com_barra_de_status(tela.convert("RGBA"))
    sw, sh = tela.size
    lado = 6  # sobra lateral para os botões
    w, h = sw + 2 * BORDA + 2 * lado, sh + 2 * BORDA
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    # botões laterais
    botoes = ImageDraw.Draw(out)
    cor_botao = (58, 58, 64, 255)
    botoes.rounded_rectangle((0, 300, lado + 4, 370), 3, fill=cor_botao)
    botoes.rounded_rectangle((0, 430, lado + 4, 560), 3, fill=cor_botao)
    botoes.rounded_rectangle((0, 590, lado + 4, 720), 3, fill=cor_botao)
    botoes.rounded_rectangle((w - lado - 4, 480, w, 690), 3, fill=cor_botao)

    # corpo: aro metálico + moldura preta
    aro = rounded((sw + 2 * BORDA, h), RAIO_TELA + BORDA, (72, 72, 80, 255))
    out.alpha_composite(aro, (lado, 0))
    corpo = rounded((sw + 2 * BORDA - 8, h - 8), RAIO_TELA + BORDA - 4, (12, 12, 14, 255))
    out.alpha_composite(corpo, (lado + 4, 4))

    # tela com cantos arredondados
    mask = rounded((sw, sh), RAIO_TELA, (0, 0, 0, 255)).getchannel("A")
    tela.putalpha(mask)
    out.alpha_composite(tela, (lado + BORDA, BORDA))

    # ilha dinâmica
    iw, ih = 216, 60
    ilha = rounded((iw, ih), ih // 2, (0, 0, 0, 255))
    out.alpha_composite(ilha, ((w - iw) // 2, BORDA + 22))
    return out


def main():
    prontos = []
    for nome in TELAS:
        img = emoldurar(Image.open(DIR / f"mobile-{nome}.png"))
        img.save(DIR / f"celular-{nome}.png", optimize=True)
        prontos.append(img)

    gap = 90
    w = sum(i.width for i in prontos) + gap * (len(prontos) - 1)
    h = max(i.height for i in prontos)
    trio = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    x = 0
    for img in prontos:
        trio.alpha_composite(img, (x, 0))
        x += img.width + gap
    escala = 2200 / w
    trio = trio.resize((2200, round(h * escala)), Image.LANCZOS)
    trio.save(DIR / "celulares.png", optimize=True)
    print(trio.size)


if __name__ == "__main__":
    main()
