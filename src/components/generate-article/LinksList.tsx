import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { List, Divider } from '@mui/material';

import { LinkItem } from './LinkItem';

import type { Link } from '../../sections/generate/schemas';

// ----------------------------------------------------------------------

interface LinksListProps {
  fields: any[];
  links: Link[];
  type: 'internal' | 'external';
  onEdit: (index: number, updatedLink: Partial<Link>) => void;
  onDelete: (index: number) => void;
  getFieldError: (index: number, field: 'url' | 'anchorText') => string | undefined;
}

export function LinksList({
  fields,
  links,
  type,
  onEdit,
  onDelete,
  getFieldError,
}: LinksListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditLink = (index: number) => {
    setEditingId(fields[index].id);
  };

  const handleSaveLink = (index: number, updatedLink: Partial<Link>) => {
    onEdit(index, updatedLink);
    setEditingId(null);
  };

  const handleDeleteLink = (index: number) => {
    onDelete(index);
    if (editingId === fields[index].id) {
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <List sx={{ p: 0 }}>
      <AnimatePresence>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LinkItem
              link={links[index]}
              index={index}
              isEditing={editingId === field.id}
              onEdit={() => handleEditLink(index)}
              onSave={(updatedLink) => handleSaveLink(index, updatedLink)}
              onDelete={() => handleDeleteLink(index)}
              onCancel={handleCancelEdit}
              urlError={getFieldError(index, 'url')}
              anchorTextError={getFieldError(index, 'anchorText')}
              type={type}
            />
            {index < fields.length - 1 && <Divider sx={{ my: 1 }} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </List>
  );
}