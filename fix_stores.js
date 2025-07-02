const fs = require('fs');
const path = require('path');

// Function to fix API calls in store files
function fixApiCalls(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix pagination assignment
  content = content.replace(
    /this\.pagination = \{\s*page: response\.page,\s*limit: response\.limit,\s*total: response\.total,\s*totalPages: response\.totalPages\s*\}/gms,
    'this.pagination = response.meta.pagination'
  );
  
  // Fix API calls
  content = content.replace(/await \$api<([^>]+)>\(`([^`]+)`, \{ method: 'POST', body: ([^}]+) \}\)/g, 'await $api.post<$1>(\'$2\', $3)');
  content = content.replace(/await \$api<([^>]+)>\(`([^`]+)`, \{ method: 'PUT', body: ([^}]+) \}\)/g, 'await $api.put<$1>(\'$2\', $3)');
  content = content.replace(/await \$api<([^>]+)>\(`([^`]+)`, \{ method: 'PATCH', body: ([^}]+) \}\)/g, 'await $api.patch<$1>(\'$2\', $3)');
  content = content.replace(/await \$api<([^>]+)>\(`([^`]+)`, \{ method: 'PATCH' \}\)/g, 'await $api.patch<$1>(\'$2\', {})');
  content = content.replace(/await \$api<([^>]+)>\(`([^`]+)`\)/g, 'await $api.get<$1>(\'$2\')');
  content = content.replace(/await \$api<([^>]+)>\('([^']+)'\)/g, 'await $api.get<$1>(\'$2\')');
  content = content.replace(/await \$api\(`([^`]+)`, \{ method: 'DELETE' \}\)/g, 'await $api.delete(\'$1\')');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

// Fix all store files
const storeFiles = [
  'stores/reports.ts',
  'stores/stats.ts', 
  'stores/tags.ts'
];

storeFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fixApiCalls(fullPath);
  }
});
