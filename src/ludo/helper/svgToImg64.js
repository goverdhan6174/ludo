function svgToImg64(svg) {
    let img = new Image();
    // get svg data
    let xml = new XMLSerializer().serializeToString(svg);

    // make it base64
    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';

    // prepend a "header"
    let image64 = b64Start + svg64;

    // set it as the source of the img element
    img.src = image64;
    return img;
}

export default svgToImg64
