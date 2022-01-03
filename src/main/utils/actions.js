
const ACTION_PRINTER_COMMANDS = {
  cutLine: (printer) => printer.addCutLine(),
  barcode: (printer, value) => printer.writeBarcode(value.text, value.options, value.imageOptions),
  qrCode: (printer, value) => printer.writeQRCode(value.text, value.options, value.imageOptions),
  text: (printer, value) => printer.writeLine(value),
  image: (printer, value) => value.flat().reduce((result, buffer) => {
    return result.then(() => printer.write(buffer));
  }, Promise.resolve()),
  feedPitch: (printer, { type, value }) => {
    if (type === 'pixel') {
      return printer.feedPitchByPixel(value);
    } else {
      return printer.feedPitchByFont(value);
    }
  },
  reset: (printer) => printer.reset(),
  setAlign: (printer, value) => printer.setAlign(value),
  setFont: (printer, value) => printer.setFont(value),
  setLineSpace: (printer, value) => printer.setLineSpace(value),
  setWordGap: (printer, value) => printer.setWordGap(value),
  setMargin: (printer, value) => printer.setMargin(value),
  setDensity: (printer, value) => printer.setDensity(value)
};

module.exports = { ACTION_PRINTER_COMMANDS };
