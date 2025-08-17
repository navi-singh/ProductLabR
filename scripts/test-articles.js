#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function testArticles() {
  console.log('🧪 Testing Generated Articles\n');

  const postsDir = path.join(__dirname, '..', 'posts');
  const categories = ['cameras', 'portable-power-stations', 'knives-tools'];
  
  let totalArticles = 0;
  let validArticles = 0;

  categories.forEach(category => {
    const categoryDir = path.join(postsDir, category);
    console.log(`📁 Testing ${category}:`);
    
    if (!fs.existsSync(categoryDir)) {
      console.log(`   ❌ Category directory doesn't exist`);
      return;
    }

    const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.md'));
    console.log(`   📄 Found ${files.length} articles`);

    files.forEach(file => {
      totalArticles++;
      const filePath = path.join(categoryDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Test frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        console.log(`   ❌ ${file}: Missing frontmatter`);
        return;
      }

      // Test required fields
      const frontmatter = frontmatterMatch[1];
      const requiredFields = ['title', 'subtitle', 'date', 'image', 'specs', 'pros', 'cons', 'price'];
      const missingFields = requiredFields.filter(field => !frontmatter.includes(field + ':'));
      
      if (missingFields.length > 0) {
        console.log(`   ❌ ${file}: Missing fields: ${missingFields.join(', ')}`);
        return;
      }

      // Test content sections
      const contentBody = content.match(/---\n[\s\S]*?\n---([\s\S]*)$/);
      if (!contentBody) {
        console.log(`   ❌ ${file}: No content body`);
        return;
      }

      const sections = contentBody[1].match(/^## (.+)$/gm);
      if (!sections || sections.length < 5) {
        console.log(`   ❌ ${file}: Insufficient sections (found ${sections ? sections.length : 0})`);
        return;
      }

      // Test word count
      const wordCount = contentBody[1].split(/\s+/).length;
      if (wordCount < 1400 || wordCount > 1800) {
        console.log(`   ⚠️  ${file}: Word count ${wordCount} (target: 1400-1600)`);
      }

      validArticles++;
      console.log(`   ✅ ${file}: Valid (${wordCount} words, ${sections.length} sections)`);
    });

    console.log('');
  });

  console.log(`📊 Summary:`);
  console.log(`   Total articles: ${totalArticles}`);
  console.log(`   Valid articles: ${validArticles}`);
  console.log(`   Success rate: ${Math.round((validArticles / totalArticles) * 100)}%\n`);

  // Test best pages exist
  console.log('🌐 Testing Best Pages:');
  const bestPages = ['page.tsx', 'portable-power-stations/page.tsx', 'cameras/page.tsx', 'knives-tools/page.tsx'];
  const bestDir = path.join(__dirname, '..', 'app', 'best');
  
  bestPages.forEach(page => {
    const pagePath = path.join(bestDir, page);
    if (fs.existsSync(pagePath)) {
      console.log(`   ✅ ${page}`);
    } else {
      console.log(`   ❌ ${page}: Missing`);
    }
  });

  console.log('\n🎉 Testing complete!');
}

testArticles();
