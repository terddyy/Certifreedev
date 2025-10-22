/**
 * Certification Dialogs Component
 * Handles add and edit dialogs
 */

import { AddCertificationDialog } from "@/components/certifications/AddCertificationDialog";
import { EditCertificationDialog } from "@/components/certifications/EditCertificationDialog";
import { type Certification } from "@/lib/types/certifications";
import { type Category } from "@/services/certificationService";
import { CertificationInput } from "@/lib/admin";

interface CertificationDialogsProps {
  isAddDialogOpen: boolean;
  editingCertification: Certification | null;
  categories: Category[];
  onAddDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onCreate: (certification: Partial<CertificationInput>) => Promise<{ error?: any }>;
  onUpdate: (id: string, updates: Partial<CertificationInput>) => Promise<{ error?: any }>;
}

export const CertificationDialogs = ({
  isAddDialogOpen,
  editingCertification,
  categories,
  onAddDialogChange,
  onEditDialogChange,
  onCreate,
  onUpdate,
}: CertificationDialogsProps) => {
  return (
    <>
      <AddCertificationDialog
        open={isAddDialogOpen}
        onOpenChange={onAddDialogChange}
        categories={categories}
        onAdd={onCreate}
      />

      <EditCertificationDialog
        open={!!editingCertification}
        onOpenChange={onEditDialogChange}
        certification={editingCertification}
        categories={categories}
        onSave={onUpdate}
      />
    </>
  );
};
