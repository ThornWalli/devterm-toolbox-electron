
export const loadFonts = () => {
  const fonts = [
    ['5x7-ISO8859-1', `url(${require('@/assets/fonts/5x7-ISO8859-1.ttf').default})`],
    ['6x12-ISO8859-1', `url(${require('@/assets/fonts/6x12-ISO8859-1.ttf').default})`],
    ['7x14-ISO8859-1', `url(${require('@/assets/fonts/7x14-ISO8859-1.ttf').default})`],
    ['Px437_CompaqThin_8x16', `url(${require('@/assets/fonts/Px437_CompaqThin_8x16.ttf').default})`]
  ];

  return Promise.all(fonts.map(async (font) => {
    console.log('load font', font[0], font[1]);
    const fontFace = (new FontFace(...font));
    await fontFace.load();
    document.fonts.add(fontFace);
    return fontFace;
  }));
};
