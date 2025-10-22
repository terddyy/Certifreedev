/**
 * EditCertificationDialog Component
 * Modal dialog for editing existing certifications
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CertificationInput } from '@/lib/admin';
import { Certification } from '@/lib/types/certifications';
import { Category, uploadCertificationAsset } from '@/services/certificationService';
import { validateFileUpload } from '@/utils/certificationUtils';
import { DEFAULT_EDIT_FORM, MAX_UPLOAD_MB, ALLOWED_FILE_TYPES } from '@/constants/certificationConstants';
import imageCompression from 'browser-image-compression';

interface EditCertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification: Certification | null;
  categories: Category[];
  onSave: (id: string, updates: Partial<CertificationInput>) => Promise<{ error?: any }>;
}

export const EditCertificationDialog = ({
  open,
  onOpenChange,
  certification,
  categories,
  onSave,
}: EditCertificationDialogProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<Partial<CertificationInput>>(DEFAULT_EDIT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when certification changes
  useEffect(() => {
    if (certification) {
      setForm({
        title: certification.title,
        provider: certification.provider,
        category: certification.category,
        difficulty: certification.difficulty,
        duration: certification.duration,
        description: certification.description,
        externalUrl: certification.external_url || '',
        certificationType: certification.certification_type,
        imageUrl: certification.image_url || '',
      });
    }
  }, [certification]);

  const handleSubmit = async () => {
    if (!certification) return;

    setIsSubmitting(true);
    const { error } = await onSave(certification.id, form);
    setIsSubmitting(false);

    if (!error) {
      onOpenChange(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !certification) return;

    // Validate file
    const validation = validateFileUpload(file, MAX_UPLOAD_MB, ALLOWED_FILE_TYPES);
    if (!validation.valid) {
      toast({
        title: 'Invalid file',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    // Compress the image
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    let processedFile = file;
    if (file.type.startsWith('image/')) {
      try {
        processedFile = await imageCompression(file, options);
        toast({ title: 'Image compressed successfully' });
      } catch (compressionError) {
        toast({
          title: 'Compression failed',
          description: 'Could not compress the image, uploading original file.',
          variant: 'destructive',
        });
      }
    }

    // Upload file
    const { url, error } = await uploadCertificationAsset(processedFile, certification.id);
    if (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setForm((prev) => ({ ...prev, imageUrl: url || prev.imageUrl }));
      toast({ title: 'File uploaded successfully' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#001d3d] border-[#003566] text-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Certification</DialogTitle>
          <DialogDescription>
            Update the certification details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <Label className="text-gray-300">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
            />
          </div>

          {/* Provider */}
          <div>
            <Label className="text-gray-300">Provider</Label>
            <Input
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-gray-300">Category</Label>
            <Select value={form.category} onValue-Change={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="bg-[#000814] border-[#003566] text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#001d3d] border-[#003566] text-white">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.name}
                    value={cat.name}
                    className="hover:bg-[#003566] hover:text-[#ffd60a]"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-gray-300">Duration</Label>
            <Input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
            />
          </div>

          {/* External URL */}
          <div className="md:col-span-2">
            <Label className="text-gray-300">External URL</Label>
            <Input
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
            />
          </div>

          {/* Image URL or Upload */}
          <div className="md:col-span-2">
            <Label className="text-gray-300">Image (URL or Upload)</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.png"
              className="mb-2 bg-[#000814] border-[#003566] text-white"
            />
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,application/pdf"
              className="text-sm text-gray-300"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-gray-400 mt-1">
              Max {MAX_UPLOAD_MB}MB. Allowed: JPG, PNG, SVG, PDF
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
              rows={4}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            className="border-[#003566] text-white hover:bg-[#003566]"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#ffc300] text-[#001d3d] font-bold hover:bg-[#ffd60a]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
