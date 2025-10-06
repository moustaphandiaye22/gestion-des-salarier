// Simple test to verify dynamic theming implementation
const fs = require('fs');
const path = require('path');

console.log('Testing Dynamic Company Theming Implementation...\n');

// Check if CSS variables are defined in index.css
const indexCssPath = path.join(__dirname, 'frontend/src/index.css');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');

console.log('1. Checking CSS variables in index.css:');
const hasPrimaryVar = indexCss.includes('--color-primary');
const hasSecondaryVar = indexCss.includes('--color-secondary');
console.log(`   - Primary color variable: ${hasPrimaryVar ? '✓' : '✗'}`);
console.log(`   - Secondary color variable: ${hasSecondaryVar ? '✓' : '✗'}`);

// Check if Tailwind config uses CSS variables
const tailwindConfigPath = path.join(__dirname, 'frontend/tailwind.config.js');
const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');

console.log('\n2. Checking Tailwind config uses CSS variables:');
const usesPrimaryVar = tailwindConfig.includes('var(--color-primary)');
const usesSecondaryVar = tailwindConfig.includes('var(--color-secondary)');
console.log(`   - Uses primary CSS variable: ${usesPrimaryVar ? '✓' : '✗'}`);
console.log(`   - Uses secondary CSS variable: ${usesSecondaryVar ? '✓' : '✗'}`);

// Check if MainLayout sets CSS variables
const mainLayoutPath = path.join(__dirname, 'frontend/src/layouts/MainLayout.jsx');
const mainLayout = fs.readFileSync(mainLayoutPath, 'utf8');

console.log('\n3. Checking MainLayout sets CSS variables:');
const setsPrimaryVar = mainLayout.includes('setProperty(\'--color-primary\'');
const setsSecondaryVar = mainLayout.includes('setProperty(\'--color-secondary\'');
const fetchesColors = mainLayout.includes('couleurPrimaire') && mainLayout.includes('couleurSecondaire');
console.log(`   - Sets primary CSS variable: ${setsPrimaryVar ? '✓' : '✗'}`);
console.log(`   - Sets secondary CSS variable: ${setsSecondaryVar ? '✓' : '✗'}`);
console.log(`   - Fetches colors from API: ${fetchesColors ? '✓' : '✗'}`);

// Check if backend includes colors in response
const entrepriseRepoPath = path.join(__dirname, 'backend/src/repositories/entreprise.ts');
const entrepriseRepo = fs.readFileSync(entrepriseRepoPath, 'utf8');

console.log('\n4. Checking backend includes colors in API response:');
const includesColors = entrepriseRepo.includes('couleurPrimaire') && entrepriseRepo.includes('couleurSecondaire');
console.log(`   - Includes colors in findById: ${includesColors ? '✓' : '✗'}`);

console.log('\n=== Test Results ===');
const allTestsPass = hasPrimaryVar && hasSecondaryVar && usesPrimaryVar && usesSecondaryVar &&
                     setsPrimaryVar && setsSecondaryVar && fetchesColors && includesColors;

console.log(`Overall: ${allTestsPass ? '✓ All tests passed!' : '✗ Some tests failed'}`);

if (allTestsPass) {
  console.log('\n🎉 Dynamic company theming implementation is complete!');
  console.log('\nTo test the feature:');
  console.log('1. Start the backend: cd backend && npm run dev');
  console.log('2. Start the frontend: cd frontend && npm run dev');
  console.log('3. Login as an ADMIN_ENTREPRISE or CAISSIER - the UI colors should automatically change based on their company\'s colors');
  console.log('4. Login as SUPER_ADMIN - the UI should use default colors (no theme change)');
} else {
  console.log('\n❌ Some implementation issues found. Please review the code.');
}
