import { forwardRef, useState, useRef } from 'react';
import { X, ImageUp } from 'lucide-react';

const INITIAL_MENU_FORM = {
  name: '',
  description: '',
  price: '',
};

const INITIAL_IMAGE_FORM = {
  imagePreview: '',
  image: null as File | null,
};

const DialogCreateItemListName = [
  {
    id: 1,
    name: 'Name',
    key: 'name',
    type: 'text',
    placeholder: 'Enter item name',
  },
  {
    id: 2,
    name: 'Description',
    key: 'description',
    type: 'text',
    placeholder: 'Enter description',
  },
  { id: 3, name: 'Price', key: 'price', type: 'number', placeholder: '0.00' },
];

interface CreateItemDialogProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const CreateItemDialog = forwardRef<
  HTMLDialogElement,
  CreateItemDialogProps
>(({ onClose, onSubmit }, ref) => {
  const fileCreateInputRef = useRef<HTMLInputElement>(null);
  const [menuForm, setMenuForm] = useState(INITIAL_MENU_FORM);
  const [imageForm, setImageForm] = useState(INITIAL_IMAGE_FORM);

  const resetForm = () => {
    (setMenuForm(INITIAL_MENU_FORM), setImageForm(INITIAL_IMAGE_FORM));
    if (fileCreateInputRef.current) {
      fileCreateInputRef.current.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageForm(INITIAL_IMAGE_FORM);
    if (fileCreateInputRef.current) {
      fileCreateInputRef.current.value = '';
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setMenuForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { ...menuForm, ...imageForm };
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="top-1/2 left-1/2 w-130 max-h-[90vh] overflow-hidden transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-xl bg-[#3d416d] text-white backdrop:bg-black backdrop:opacity-30 shadow-2xl"
    >
      <header className="flex justify-between items-center pb-8">
        <span className="font-semibold text-xl text-[#fac604]">New Item</span>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-[#6974e1] rounded-lg transition-colors duration-300"
        >
          <X />
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        <main className="flex flex-col justify-between gap-5">
          {DialogCreateItemListName.map((list) => (
            <div key={list.id} className="flex justify-between items-top">
              <span className="font-normal text-xl">{list.name} :</span>
              <input
                id={list.key}
                type={list.type}
                value={menuForm[list.key as keyof typeof menuForm]}
                placeholder={list.placeholder}
                onChange={(e) => handleInputChange(list.key, e.target.value)}
                required
                className="min-h-12 w-80 pl-2 border-2 border-bg-white font-normal text-md text-white rounded-xl transition-colors"
              />
            </div>
          ))}

          <div className="flex justify-between items-top">
            <span className="font-normal text-xl">Image :</span>
            <div className="flex flex-col justify-end items-end">
              <label
                htmlFor="create-image-upload"
                className="flex justify-end items-center gap-2 mt-1 mb-3"
              >
                <ImageUp />
                <span className="font-normal text-lg text-center transition-all ease-in-out duration-300">
                  {imageForm.imagePreview
                    ? 'Click to change image'
                    : 'Click to upload image'}
                </span>
              </label>

              <input
                ref={fileCreateInputRef}
                id="create-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imageForm.imagePreview && (
                <div className="relative w-full h-auto rounded-lg">
                  <img
                    src={imageForm.imagePreview}
                    alt="Preview"
                    className="w-60 max-h-60 object-cover rounded-2xl"
                  />
                  <button
                    className="absolute top-2 right-2 z-50 text-red-500 font-bold rounded-lg bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-300"
                    type="button"
                    onClick={handleImageRemove}
                  >
                    <X size={30} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-start items-center pr-6 py-2 text-[#fac604] rounded-lg hover:bg-[#fac604] hover:text-black transition-colors duration-300"
            >
              <span className="font-semibold text-xl hover:translate-x-3 transition-all duration-300">
                Finish
              </span>
            </button>
          </div>
        </main>
      </form>
    </dialog>
  );
});

CreateItemDialog.displayName = 'createitemdialog';
