// randomly plant the flower
module.exports = function generatePosition() {
    return {
        // spread across screen width
        x: Math.random() * 1200 + 100,

        // near ground area
        y: Math.random() * 150 + 500
    };
};