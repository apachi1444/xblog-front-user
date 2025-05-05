import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';


// Sample content for mock sections
const SAMPLE_CONTENT = [
  "This section will cover the introduction to the topic, providing background information and context for the reader. It will establish the importance of the subject matter and outline the key points that will be discussed in the article.",
  "Here we'll explore the main concepts and principles related to the topic. This section will dive deeper into the subject matter, explaining core ideas and their significance.",
  "This section examines practical applications and real-world examples. It demonstrates how the concepts discussed can be applied in various contexts and situations.",
  "In this section, we'll analyze the benefits and advantages of the approaches discussed earlier. We'll highlight positive outcomes and potential gains from implementing these ideas.",
  "This section addresses common challenges and potential obstacles. It provides strategies for overcoming these difficulties and offers solutions to typical problems.",
  "Here we'll look at future trends and developments in this field. This section discusses emerging technologies, evolving practices, and what readers might expect to see in the coming years."
];

export const useContentStructuringForm = (initialSections: SectionItem[] = []) => {
  // Create default sections if none provided
  const defaultSections = initialSections.length > 0
    ? initialSections
    : Array(4).fill(0).map((_, index) => ({
        id: (index + 1).toString(),
        title: `Section ${index + 1}: ${['Introduction', 'Main Concepts', 'Applications', 'Benefits'][index] || 'Additional Content'}`,
        content: SAMPLE_CONTENT[index] || SAMPLE_CONTENT[0]
      }));

  const [sections, setSections] = useState<SectionItem[]>(defaultSections);
  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false)

  // Update sections when initialSections prop changes
  useEffect(() => {
    if (initialSections.length > 0) {
      setSections(initialSections);
    }
  }, [initialSections]);

  const handleSectionsChange = useCallback((newSections: SectionItem[]) => {
    setSections(newSections);
  }, []);

  const handleAddSection = useCallback(() => {
    const newId = (sections.length + 1).toString();
    const newSection: SectionItem = {
      id: newId,
      title: `Section ${newId}: New Section`,
      content: ''
    };

    setSections([...sections, newSection]);

    setCurrentSection(newSection);
    setEditDialogOpen(true);
  }, [sections]);

  const handleEditSection = useCallback((section: SectionItem, externalEditHandler?: (section: SectionItem) => void) => {
    // Set the current section first
    setCurrentSection(section);

    if (externalEditHandler) {
      // If an external handler is provided, call it with the section
      externalEditHandler(section);
    } else {
      // Otherwise, open the edit dialog
      setEditDialogOpen(true);
    }
  }, []);

  const handleDeleteSection = useCallback((sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    toast.success("Section deleted successfully!");
  }, [sections]);

  const handleSaveSection = useCallback((updatedSection: SectionItem) => {
    console.log('Saving section in useContentStructuringForm:', updatedSection);

    // Update the sections state with the updated section
    setSections(prevSections => {
      const newSections = prevSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      );
      console.log('Updated sections:', newSections);
      return newSections;
    });

    // Close the edit dialog
    setEditDialogOpen(false);

    // Reset the current section
    setCurrentSection(null);
  }, []);

  // Generate table of contents based on title
  const handleGenerateTableOfContents = async (title: string, onGenerate?: () => void) => {
    setIsGenerating(true);

    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 6000));

      try {
        const keyword = title || 'Topic';
        const mockSections = [
          {
            id: 'section-1',
            status: 'Completed',
            title: `Introduction to ${keyword}`,
            content: `This section provides an overview of ${keyword} and why it's important.`
          },
          {
            id: 'section-2',
            status: 'Completed',
            title: `Benefits of ${keyword}`,
            content: `This section explores the main benefits and advantages of ${keyword}.`
          },
          {
            id: 'section-3',
            status: 'Completed',
            title: `How to Implement ${keyword}`,
            content: `This section provides practical steps for implementing ${keyword} effectively.`
          },
          {
            id: 'section-4',
            status: 'Completed',
            title: `${keyword} Best Practices`,
            content: `This section covers the best practices and tips for optimizing ${keyword}.`
          },
        ] as any;

        setSections(mockSections);
        setIsGenerated(true);

        if (onGenerate) {
          onGenerate();
        }

        toast.success('Generated table of contents successfully');
      } catch (apiError) {
        toast.error('Failed to generate table of contents');
      }
    } catch (error) {
      toast.error('Failed to generate table of contents');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelSectionChanges = useCallback(() => {
    // Close the edit dialog
    setEditDialogOpen(false);

    // Reset the current section state to null
    setCurrentSection(null);

    // Optionally show a toast notification
    toast.error("Changes discarded");
  }, []);

  return {
    sections,
    setSections,
    currentSection,
    setCurrentSection,
    editDialogOpen,
    setEditDialogOpen,
    isGenerating,
    isGenerated,
    setIsGenerating,
    handleSectionsChange,
    handleAddSection,
    handleEditSection,
    handleDeleteSection,
    handleSaveSection,
    handleGenerateTableOfContents,
    handleCancelSectionChanges
  };
};
