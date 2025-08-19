// Test script to verify markdown conversion
// Run this in browser console to test the conversion

const testArticleInfo = {
  title: "Test Article",
  metaTitle: "Test Meta Title",
  metaDescription: "This is a test meta description",
  primaryKeyword: "test keyword",
  secondaryKeywords: ["secondary", "keywords"],
  language: "en",
  targetCountry: "US",
  createdAt: new Date().toISOString()
};

const testSections = [
  {
    id: "1",
    title: "Introduction",
    content: "This is the introduction content with <strong>HTML tags</strong> and <em>formatting</em>.",
    type: "introduction"
  },
  {
    id: "2", 
    title: "Main Content",
    content: "<p>This is a paragraph with <a href='#'>links</a> and other HTML elements.</p><ul><li>List item 1</li><li>List item 2</li></ul>",
    bulletPoints: ["Point 1", "Point 2", "Point 3"]
  },
  {
    id: "3",
    title: "Conclusion", 
    content: "This is the conclusion section.",
    type: "conclusion"
  }
];

// Test the conversion
console.log("Testing markdown conversion...");
console.log("Article Info:", testArticleInfo);
console.log("Sections:", testSections);

// This would be called in the actual app
// import('src/utils/markdownConverter').then(({ articleToMarkdown }) => {
//   const result = articleToMarkdown(testArticleInfo, testSections);
//   console.log("Markdown Result:", result);
// });

console.log("Test data prepared. Use this in the actual modals to debug.");
