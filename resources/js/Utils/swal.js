// resources/js/Utils/swal.js
import Swal from 'sweetalert2';

// Buat custom class agar seragam pakai Tailwind
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

export const showAlert = (title, text, icon = 'success') => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#3b82f6', // Sesuaikan dengan warna primer Tailwind kamu (misal blue-500)
    });
};

export const showConfirm = (title, text, confirmText = 'Ya, Hapus!') => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // red-500
        cancelButtonColor: '#6b7280',  // gray-500
        confirmButtonText: confirmText,
        cancelButtonText: 'Batal',
    });
};

export const showToast = (title, icon = 'success') => {
    Toast.fire({
        icon: icon,
        title: title
    });
};
