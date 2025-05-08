/**
 * Utility functions to convert article content to markdown format
 */

// Define the interface for article sections (should match the one in your codebase)
interface SectionLink {
  text: string;
  url: string;
}

interface SectionImage {
  url: string;
  alt: string;
  caption?: string;
}

interface SectionFaqItem {
  question: string;
  answer: string;
}

interface SectionTableData {
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  id: string;
  title: string;
  content?: string;
  contentType?: string;
  bulletPoints?: string[];
  internalLinks?: SectionLink[];
  externalLinks?: SectionLink[];
  tableData?: SectionTableData;
  faqItems?: SectionFaqItem[];
  images?: SectionImage[];
  subsections?: ArticleSection[];
  type?: 'introduction' | 'regular' | 'conclusion' | 'faq';
}

export interface ArticleInfo {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  language: string;
  targetCountry: string;
  contentDescription?: string;
  createdAt: string;
  articleType?: string;
  articleSize?: string;
  toneOfVoice?: string;
}

/**
 * Convert a section to markdown format
 * @param section The section to convert
 * @returns Markdown string for the section
 */
export const sectionToMarkdown = (section: ArticleSection): string => {
  let markdown = `## ${section.title}\n\n`;

  // Add main content
  if (section.content) {
    markdown += `${section.content}\n\n`;
  }

  // Add bullet points
  if (section.bulletPoints && section.bulletPoints.length > 0) {
    section.bulletPoints.forEach(point => {
      markdown += `* ${point}\n`;
    });
    markdown += '\n';
  }

  // Add table data
  if (section.tableData && section.tableData.headers && section.tableData.rows) {
    // Table headers
    markdown += `| ${  section.tableData.headers.join(' | ')  } |\n`;
    // Table separator
    markdown += `| ${  section.tableData.headers.map(() => '---').join(' | ')  } |\n`;
    // Table rows
    section.tableData.rows.forEach(row => {
      markdown += `| ${  row.join(' | ')  } |\n`;
    });
    markdown += '\n';
  }

  // Add FAQ items
  if (section.faqItems && section.faqItems.length > 0) {
    section.faqItems.forEach(faq => {
      markdown += `### ${faq.question}\n\n${faq.answer}\n\n`;
    });
  }

  // Add images
  if (section.images && section.images.length > 0) {
    section.images.forEach(image => {
      markdown += `![${image.alt}](${image.url})`;
      if (image.caption) {
        markdown += `\n*${image.caption}*`;
      }
      markdown += '\n\n';
    });
  }

  // Add internal links
  if (section.internalLinks && section.internalLinks.length > 0) {
    markdown += '**Related Content:**\n\n';
    section.internalLinks.forEach(link => {
      markdown += `* [${link.text}](${link.url})\n`;
    });
    markdown += '\n';
  }

  // Add external links
  if (section.externalLinks && section.externalLinks.length > 0) {
    markdown += '**Sources:**\n\n';
    section.externalLinks.forEach(link => {
      markdown += `* [${link.text}](${link.url})\n`;
    });
    markdown += '\n';
  }

  return markdown;
};

/**
 * Convert an entire article to markdown format
 * @param articleInfo The article info
 * @param sections The article sections
 * @returns Markdown string for the entire article
 */
export const articleToMarkdown = (articleInfo: ArticleInfo, sections: ArticleSection[]): string => {
  let markdown = `# ${articleInfo.title}\n\n`;

  // Add metadata
  markdown += `*Date: ${new Date(articleInfo.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}*\n\n`;

  markdown += `*Language: ${articleInfo.language.toUpperCase()} | Region: ${articleInfo.targetCountry}*\n\n`;

  // Add keywords
  markdown += `**Primary Keyword:** ${articleInfo.primaryKeyword}\n\n`;
  
  if (articleInfo.secondaryKeywords && articleInfo.secondaryKeywords.length > 0) {
    markdown += `**Secondary Keywords:** ${articleInfo.secondaryKeywords.join(', ')}\n\n`;
  }

  // Add meta description if available
  if (articleInfo.metaDescription) {
    markdown += `> ${articleInfo.metaDescription}\n\n`;
  }

  // Add horizontal rule before content
  markdown += '---\n\n';

  // Add all sections
  sections.forEach(section => {
    markdown += sectionToMarkdown(section);
  });

  return markdown;
};

/**
 * Convert an article to HTML format
 * @param articleInfo The article info
 * @param sections The article sections
 * @returns HTML string for the entire article
 */
export const articleToHtml = (articleInfo: ArticleInfo, sections: ArticleSection[]): string => {
  let html = `<h1>${articleInfo.title}</h1>`;

  // Add metadata
  html += `<p><em>Date: ${new Date(articleInfo.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}</em></p>`;

  html += `<p><em>Language: ${articleInfo.language.toUpperCase()} | Region: ${articleInfo.targetCountry}</em></p>`;

  // Add keywords
  html += `<p><strong>Primary Keyword:</strong> ${articleInfo.primaryKeyword}</p>`;
  
  if (articleInfo.secondaryKeywords && articleInfo.secondaryKeywords.length > 0) {
    html += `<p><strong>Secondary Keywords:</strong> ${articleInfo.secondaryKeywords.join(', ')}</p>`;
  }

  // Add meta description if available
  if (articleInfo.metaDescription) {
    html += `<blockquote>${articleInfo.metaDescription}</blockquote>`;
  }

  // Add horizontal rule before content
  html += '<hr>';

  // Add all sections
  sections.forEach(section => {
    html += sectionToHtml(section);
  });

  return html;
};

/**
 * Convert a section to HTML format
 * @param section The section to convert
 * @returns HTML string for the section
 */
const sectionToHtml = (section: ArticleSection): string => {
  let html = `<h2>${section.title}</h2>`;

  // Add main content
  if (section.content) {
    html += `<p>${section.content.replace(/\n/g, '</p><p>')}</p>`;
  }

  // Add bullet points
  if (section.bulletPoints && section.bulletPoints.length > 0) {
    html += '<ul>';
    section.bulletPoints.forEach(point => {
      html += `<li>${point}</li>`;
    });
    html += '</ul>';
  }

  // Add table data
  if (section.tableData && section.tableData.headers && section.tableData.rows) {
    html += '<table border="1" cellpadding="5">';
    // Table headers
    html += '<thead><tr>';
    section.tableData.headers.forEach(header => {
      html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';
    // Table rows
    html += '<tbody>';
    section.tableData.rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
  }

  // Add FAQ items
  if (section.faqItems && section.faqItems.length > 0) {
    section.faqItems.forEach(faq => {
      html += `<h3>${faq.question}</h3><p>${faq.answer}</p>`;
    });
  }

  // Add images
  if (section.images && section.images.length > 0) {
    section.images.forEach(image => {
      html += `<div><img src="${image.url}" alt="${image.alt}" style="max-width:100%;">`;
      if (image.caption) {
        html += `<p><em>${image.caption}</em></p>`;
      }
      html += '</div>';
    });
  }

  // Add internal links
  if (section.internalLinks && section.internalLinks.length > 0) {
    html += '<div><strong>Related Content:</strong><ul>';
    section.internalLinks.forEach(link => {
      html += `<li><a href="${link.url}">${link.text}</a></li>`;
    });
    html += '</ul></div>';
  }

  // Add external links
  if (section.externalLinks && section.externalLinks.length > 0) {
    html += '<div><strong>Sources:</strong><ul>';
    section.externalLinks.forEach(link => {
      html += `<li><a href="${link.url}" target="_blank" rel="noopener">${link.text}</a></li>`;
    });
    html += '</ul></div>';
  }

  return html;
};
