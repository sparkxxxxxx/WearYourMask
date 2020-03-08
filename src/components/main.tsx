import React from "react";
import ReactDOM from 'react-dom';
import './main.css';
import * as faceapi from 'face-api.js';
import { FaceMatcher, Point } from "face-api.js";

class Main extends React.Component {

    public state = {
        imgSrc: '',
        fileInput: Element,
        image: new Image()
    }

    faceMatcher: FaceMatcher | undefined;

    constructor(props: Readonly<{}>) {
        super(props);
        this.uploadRefImage = this.uploadRefImage.bind(this);
        this.state.image.src = 'data:image/png;base64,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';
    }

    async uploadRefImage(e: any) {
        const imgFile = e.target.files[0];
        const img = await faceapi.bufferToImage(imgFile);
        this.setState({
            imgSrc: img.src
        });
        this.updateReferenceImageResults();
    }

    addMask(points: Point[]) {
        let masArray = [];
        const canvas = this.refs.refImgOverlay as any;
        const inputImgEl = this.refs.refImg as HTMLImageElement;

        masArray.push(points[3]);
        masArray.push(points[9]);
        masArray.push(points[15]);
        masArray.push(points[29]);
        console.log(points[3].x, points[9].y, points[15].x - points[3].x, points[29].y - points[9].y);
        if (canvas) {
            let ctx = canvas.getContext('2d');
            canvas.width = inputImgEl.width;
            canvas.height = inputImgEl.height;
            // ctx.rect(points[3].x, points[9].y, points[15].x - points[3].x, points[29].y - points[9].y);
            // ctx.rect(0, 0, inputImgEl.width, inputImgEl.height);
            ctx.drawImage(this.state.image, points[3].x, points[29].y, points[15].x - points[3].x, points[9].y - points[29].y);
            // ctx.translate(points[3].x, points[9].y);
            // ctx.fillRect(0, 0, points[15].x - points[3].x, points[9].y - points[29].y);
        }
    }

    async updateReferenceImageResults() {
        const inputImgEl = this.refs.refImg;
        const canvas = this.refs.refImgOverlay;


        const fullFaceDescriptions = await faceapi
            .detectAllFaces(inputImgEl as faceapi.TNetInput)
            .withFaceLandmarks()
            .withFaceDescriptors()


        if (!fullFaceDescriptions.length) {
            return
        }

        fullFaceDescriptions.forEach(x => {
            this.addMask(x.landmarks.positions);
        })
        // this.faceMatcher = new faceapi.FaceMatcher(fullFaceDescriptions)

        // faceapi.matchDimensions(canvas as unknown as faceapi.IDimensions, inputImgEl as unknown as faceapi.IDimensions)
        // const resizedResults = faceapi.resizeResults(fullFaceDescriptions, inputImgEl as unknown as faceapi.IDimensions)

        // resizedResults.forEach(({ detection, descriptor }) => {
        //     if (this.faceMatcher !== undefined) {
        //         const label = this.faceMatcher.findBestMatch(descriptor).toString()
        //         const options = { label }
        //         const drawBox = new faceapi.draw.DrawBox(detection.box, options)
        //         drawBox.draw(canvas as HTMLCanvasElement)
        //     }
        // });
    }

    async componentDidMount() {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    }

    render() {
        return (
            <div>
                <header>wear mask</header>
                <h1>请选择人像图片上传，上传后有点卡，稍等</h1>
                <div className="panel" >
                    <div className="panel-c " >
                        <img ref="refImg" src={this.state.imgSrc} />
                        <canvas ref="refImgOverlay" className="overlay" />
                    </div>
                </div>
                <input id="inputImgEl" type="file" onChange={this.uploadRefImage} accept=".jpg, .jpeg, .png" />
            </div>
        );
    }
}

export default Main