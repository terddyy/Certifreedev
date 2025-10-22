/**
 * AddCertificationDialog Component
 * Modal dialog for creating new certifications
 */

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CertificationInput } from '@/lib/admin';
import { Category, uploadCertificationAsset } from '@/services/certificationService';
import { generateSlugFromTitle, validateFileUpload } from '@/utils/certificationUtils';
import { DEFAULT_ADD_FORM, MAX_UPLOAD_MB, ALLOWED_FILE_TYPES } from '@/constants/certificationConstants';
import imageCompression from 'browser-image-compression';

interface AddCertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onAdd: (certification: Partial<CertificationInput>) => Promise<{ error?: any }>;
}

export const AddCertificationDialog = ({
  open,
  onOpenChange,
  categories,
  onAdd,
}: AddCertificationDialogProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<Partial<CertificationInput>>(DEFAULT_ADD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await onAdd(form);
    setIsSubmitting(false);

    if (!error) {
      // Reset form and close dialog on success
      setForm(DEFAULT_ADD_FORM);
      onOpenChange(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Require title first
    if (!form.title) {
      toast({
        title: 'Provide a title first',
        description: 'We need a title to generate the ID for file storage.',
        variant: 'destructive',
      });
      return;
    }

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

    // Generate ID from title for file upload
    const generatedId = generateSlugFromTitle(form.title);
    if (!generatedId) {
      toast({
        title: 'Invalid title',
        description: 'Could not generate a valid ID from the title.',
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
    const { url, error } = await uploadCertificationAsset(processedFile, generatedId);
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
          <DialogTitle className="text-white">Add Certification</DialogTitle>
          <DialogDescription>
            Provide the details below to create a new certification.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <Label className="text-gray-300">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
              placeholder="AWS Certified Solutions Architect"
            />
          </div>

          {/* Provider */}
          <div>
            <Label className="text-gray-300">Provider *</Label>
            <Input
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
              placeholder="Amazon Web Services"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-gray-300">Category *</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
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

          {/* Type */}
          <div>
            <Label className="text-gray-300">Type</Label>
            <Select
              value={form.type}
              onValueChange={(v: 'public' | 'certifree') => setForm({ ...form, type: v })}
            >
              <SelectTrigger className="bg-[#000814] border-[#003566] text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#001d3d] border-[#003566] text-white">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="certifree">CertiFree</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course ID (CertiFree only) */}
          {form.type === 'certifree' && (
            <div>
              <Label className="text-gray-300">Course ID (for CertiFree)</Label>
              <Input
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="bg-[#000814] border-[#003566] text-white"
                placeholder="Optional: Link to an existing course"
              />
            </div>
          )}

          {/* Duration */}
          <div>
            <Label className="text-gray-300">Duration</Label>
            <Input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
              placeholder="e.g., 20-30 hours"
            />
          </div>

          {/* External URL */}
          <div className="md:col-span-2">
            <Label className="text-gray-300">External URL *</Label>
            <Input
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className="bg-[#000814] border-[#003566] text-white"
              placeholder="https://..."
            />
          </div>

          {/* Image URL or Upload */}
          <div className="md:col-span-2">
            <Label className="text-gray-300">Image (URL or Upload)</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="mb-2 bg-[#000814] border-[#003566] text-white"
              placeholder="https://example.com/image.png"
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
              placeholder="Brief description of the certification..."
              rows={4}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            className="border-[#003566] text-white hover:bg-[#003566]"
            onClick={() => {
              setForm(DEFAULT_ADD_FORM);
              onOpenChange(false);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#ffc300] text-[#001d3d] font-bold hover:bg-[#ffd60a]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
