export const setMultipleUploadAndPreviewImage = (setUploadImage: Function, setPreviewImage: Function, multiple: boolean = false): (e: React.ChangeEvent<HTMLInputElement>) => void => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = e.target.files
      const files = Array.from(fileList)
      let filesWithUniqueKey: {[key: string]: File} = {}
      let urlWithUniqueKey: {[key: string]: string} = {}
      files.map((file) => {
        const url = window.URL.createObjectURL(file)
        filesWithUniqueKey[url] = file
        urlWithUniqueKey[url] = url
      })
      setUploadImage(filesWithUniqueKey)
      setPreviewImage(urlWithUniqueKey)
    }
  }
}

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