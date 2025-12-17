import { forwardRef, useState } from 'react';
import { X } from 'lucide-react';

const INITIAL_CATEGORY_FORM = { name: '' };

interface CreateCategoryDialogProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const CreateCategoryDialog = forwardRef<
  HTMLDialogElement,
  CreateCategoryDialogProps
>(({ onSubmit, onClose }, ref) => {
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);

  const resetForm = () => {
    setCategoryForm(INITIAL_CATEGORY_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { ...categoryForm };
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (value: string) => {
    setCategoryForm({ name: value });
  };

  return (
    <dialog
      ref={ref}
      className="top-1/2 left-1/2 w-130 max-h-[90vh] overflow-hidden transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-xl bg-[#3d416d] text-white backdrop:bg-black backdrop:opacity-30 shadow-2xl"
    >
      <header className="flex justify-between items-center pb-8">
        <span className="font-semibold text-xl text-[#fac604]">
          New Category
        </span>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-[#6974e1] rounded-lg transition-colors duration-300"
        >
          <X />
        </button>
      </header>
      <form onSubmit={handleSubmit}>
        <main className="flex flex-col justify-between gap-5 mb-3">
          <div className="flex justify-between items-top">
            <span className="font-normal text-xl">Name :</span>
            <input
              id="name"
              type="text"
              value={categoryForm.name}
              placeholder="category name"
              required
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-12 w-80 pl-2 border-2 border-bg-white font-normal text-md text-white rounded-xl transition-colors"
            />
          </div>
        </main>
        <button
          type="submit"
          className="flex justify-start items-center pr-6 py-2 text-[#fac604] rounded-lg hover:bg-[#fac604] hover:text-black transition-colors duration-300"
        >
          <span className="font-semibold text-xl hover:translate-x-3 transition-all duration-300">
            Finish
          </span>
        </button>
      </form>
    </dialog>
  );
});
