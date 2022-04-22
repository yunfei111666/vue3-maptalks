export const getModelInfo = (model) => {
    const size = model.getSize();
    const position = model.getCoordinates();
    const speed = model.speed;
    const target_point = model.target_point;
    return {
        size,
        position,
        speed,
        target_point
    }
}