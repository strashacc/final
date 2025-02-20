window.onload = () => {
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.onclick = () => {deleteDialog()};
}

function deleteDialog() {
    const deleteDialog = document.getElementById('deleteDialog');
    deleteDialog.toggleAttribute('hidden');
}