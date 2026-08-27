/* AAIRAGALAXY STARFIELD */

const canvas =
    document.getElementById("stars");

if (canvas) {

    const ctx =
        canvas.getContext("2d");

    let width = 0;
    let height = 0;

    function resizeCanvas() {

        width =
            window.innerWidth;

        height =
            window.innerHeight;

        canvas.width = width;
        canvas.height = height;
    }

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    const stars = [];

    const STAR_COUNT = 180;


    for (
        let i = 0;
        i < STAR_COUNT;
        i++
    ) {

        stars.push({

            x:
                Math.random() * width,

            y:
                Math.random() * height,

            size:
                Math.random() * 2,

            speed:
                Math.random() * 0.5 + 0.1
        });
    }


    function animateStars() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        stars.forEach(star => {

            star.y += star.speed;

            if (star.y > height) {

                star.y = 0;
                star.x =
                    Math.random() * width;
            }

            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });

        requestAnimationFrame(
            animateStars
        );
    }

    animateStars();
}