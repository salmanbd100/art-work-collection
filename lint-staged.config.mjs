export default {
  '*.ts': ['eslint --fix', 'prettier --write'],
  '*.html': ['eslint --fix', 'prettier --write'],
  '*.{scss,md,json}': ['prettier --write'],
};
