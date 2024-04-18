export const setMultipleUploadAndPreviewImage = (setUploadImage: Function, setPreviewImage: Function, imageHash: {[key: string]: File}, previewHash: {[key: string]: string}): (e: React.ChangeEvent<HTMLInputElement>) => void => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const copyImageHash = {...imageHash}
      const copyPreviewHash = {...previewHash}
      const fileList = e.target.files
      const files = Array.from(fileList)
      let filesWithUniqueKey: {[key: string]: File} = {}
      let urlWithUniqueKey: {[key: string]: string} = {}
      files.map((file) => {
        const url = window.URL.createObjectURL(file)
        filesWithUniqueKey[url] = file
        urlWithUniqueKey[url] = url
      })
      setUploadImage(Object.assign(filesWithUniqueKey, copyImageHash))
      setPreviewImage(Object.assign(urlWithUniqueKey, copyPreviewHash))
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