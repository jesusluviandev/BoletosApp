import { toast } from 'sonner';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export const confirmDialog = ({
  title,
  description,
  confirmText = 'Sí, eliminar',
  cancelText = 'Cancelar',
}: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(title, {
      description,
      duration: Infinity,
      action: {
        label: confirmText,
        onClick: () => resolve(true),
      },
      cancel: {
        label: cancelText,
        onClick: () => resolve(false),
      },
      onDismiss: () => resolve(false),
      onAutoClose: () => resolve(false),
    });
  });
};
