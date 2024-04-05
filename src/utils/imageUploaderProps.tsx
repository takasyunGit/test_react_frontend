export const uploadImage = (setImage: Function): (e: React.ChangeEvent<HTMLInputElement>) => void => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setImage(file)
    }
  }
}

export const previewImage = (setPreview: Function): (e: React.ChangeEvent<HTMLInputElement>) => void => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setPreview(window.URL.createObjectURL(file))
    }
  }
}

export const inputClear = (id: string) => {
  const target = document.getElementById(id) as HTMLInputElement
  if (target) {target.value = ''}
}