const {imread,imshow,waitKey,Mat,CV_8UC3,CV_8UC1,imshowWait} = require('opencv4nodejs')
const rows = 1000; // height
const cols = 1000; // width
// const emptyMat = new Mat(rows, cols, CV_8UC1,255); //  CV_8UC1白色单通道
const emptyMat = new Mat(rows, cols, CV_8UC3,[255,0,0]); // CV_8UC3 三单通道
imshowWait("111",emptyMat)
waitKey()