module.exports = function generateLicenseId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LIC-${random}`;
};
