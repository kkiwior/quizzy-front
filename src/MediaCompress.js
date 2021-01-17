export default {
    toWebp: (file, props) => new Promise(resolve => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const image = new Image();
            const canvas = document.createElement('canvas');
            canvas.width = props.width;
            canvas.height = props.height;
            const ctx = canvas.getContext('2d');
            image.onload = () => {
                let scale = Math.max(props.width / image.width, props.height / image.height);
                let x = (props.width / 2) - (image.width / 2) * scale;
                let y = (props.height / 2) - (image.height / 2) * scale;
                ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
                canvas.toBlob((blob) => {
                    if (blob.size > 2048000) {
                        return;
                    }

                    resolve(blob);
                }, 'image/webp')
            }
            image.src = fileReader.result;
        }
        fileReader.readAsDataURL(file);
    })
}