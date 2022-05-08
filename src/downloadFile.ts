import { message } from "antd";

// 下载文件处理方法
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (res: any, fileName: string): any => {
  const blob = new Blob([res]);
  // 创建新的URL并指向File对象或者Blob对象的地址
  const blobURL = window.URL.createObjectURL(blob);
  // 创建a标签，用于跳转至下载链接
  const tempLink = document.createElement("a");
  tempLink.style.display = "none";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", decodeURIComponent(fileName));
  // 兼容：某些浏览器不支持HTML5的download属性
  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank");
  }
  // 挂载a标签
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  // 释放blob URL地址
  window.URL.revokeObjectURL(blobURL);
};
