import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Engine, Render, Bodies, World, Events, Composite } from "matter-js";

const pinGap = 25;
const pinSize = 3;

const generateRouteWalls = (cw: number, ch: number, _randomNumber: number) => {
  const randomNumber = Number(`0x${_randomNumber}`)
  const leastSignificant8Bits = randomNumber & 255;
  console.log('leastSignificant8Bits: ', leastSignificant8Bits)
  const binaryRepr = leastSignificant8Bits.toString(2);
  const count = binaryRepr.split("").filter((bit) => bit === "1").length;
  console.log("count: ", count);
  console.log("binaryRepr: ", binaryRepr.padStart(8, "0"));
  const trapWidth = pinGap * 6;
  const trapHeight = pinGap * 8;
  return [
    Bodies.trapezoid(
      cw / 2 - pinGap * 4.5 - trapWidth / 2 + count * pinGap - 5,
      ch / 8 + 9 * pinGap + 10 - trapHeight / 2,
      trapWidth,
      trapHeight,
      1.35,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: 1234567890,
      }
    ),
    Bodies.trapezoid(
      cw / 2 - pinGap * 4.5 + trapWidth / 2 + pinGap + 10 + count * pinGap - 5,
      ch / 8 + 9 * pinGap + 10 - trapHeight / 2,
      -trapWidth,
      trapHeight,
      1.35,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: 1234567891,
      }
    ),
    Bodies.rectangle(
      cw / 2 - pinGap * 4.5 - 5 + count * pinGap,
      ch / 8 + 8 * pinGap + pinGap,
      10,
      2 * pinGap,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: 1234567892,
      }
    ),
    Bodies.rectangle(
      cw / 2 - pinGap * 4.5 + 5 + (count + 1) * pinGap,
      ch / 8 + 8 * pinGap + pinGap,
      10,
      2 * pinGap,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: 1234567893,
      }
    ),
  ];
};

function generatePins(cw, ch) {
  const pins = [];
  for (let l = 0; l < 8; l++) {
    const linePins = 3 + l;
    const lineWidth = linePins * pinGap;
    for (let i = 0; i < linePins; i++) {
      const pinX = cw / 2 - lineWidth / 2 + i * pinGap + pinGap / 2;

      const pinY = ch / 8 + l * pinGap + pinGap;

      const pin = Bodies.circle(pinX, pinY, pinSize, {
        label: `pin-${i}`,
        render: {
          fillStyle: "#F5DCFF",
        },
        isStatic: true,
        friction: 0,
      });
      pins.push(pin);
    }
  }
  return pins;
}

function generateMultipliers(cw, ch) {
  const multiplierBodies = [];
  const multipliers = [
    {
      label: "block",
    },
    {
      label: "block",
    },
    {
      label: "block",
    },
    {
      label: "block",
    },
    {
      label: "block",
    },
    {
      label: "block",
    },
    {
      label: "block",
    },
    {
      label: "block",
    },
    {
      label: "block",
    },
  ];

  let lastMultiplierX = cw / 2 - (pinGap / 2) * 8 - pinGap;
  multipliers.forEach((multiplier) => {
    const blockSize = 25; // height and width
    const multiplierBody = Bodies.rectangle(
      lastMultiplierX + 25,
      ch / 8 + 8 * pinGap + 40,
      blockSize,
      blockSize,
      {
        label: multiplier.label,
        isStatic: true,
        render: {
          sprite: {
            xScale: 1,
            yScale: 1,
            // texture: multiplier.img
          },
        },
      }
    );
    lastMultiplierX = multiplierBody.position.x;
    multiplierBodies.push(multiplierBody);
  });
  return multiplierBodies;
}

const PlinkoGame = forwardRef((props, ref) => {
  const scene = useRef();
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());

  async function onBodyCollision(event: IEventCollision<Engine>) {
    // console.log(event);
    const pairs = event.pairs;
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (bodyB.label.includes("ball") && bodyA.label.includes("block")) {
        setTimeout(() => {
          World.remove(engine.current.world, bodyB);
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, 1234567890, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, 1234567891, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, 1234567892, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, 1234567893, "body")
          );
        }, 250);
        // console.log("collision detected ", event.pairs[0]);
      }
    }
  }

  Events.on(engine.current, "collisionActive", onBodyCollision);

  useEffect(() => {
    console.log("cw: ", scene.current.clientWidth);
    console.log("ch: ", scene.current.clientHeight);
    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
      },
    });
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(-10, ch / 2, 20, ch, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, {
        isStatic: true,
        render: { visible: false },
      }),
    ]);
    World.add(engine.current.world, generatePins(cw, ch));
    World.add(engine.current.world, generateMultipliers(cw, ch));
    engine.current.gravity.y = 0.5;
    Engine.run(engine.current);
    Render.run(render);
    return () => {
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  const addBall = (x, y, random_number) => {
    const ball = Bodies.circle(x, y, 5, {
      restitution: 0.5,
      friction: 0.1,
      frictionAir: 0.01,
      label: "ball",
      collisionFilter: {
        group: -1,
      },
      id: 222
    });
    console.log('generating route walls with rand: ', random_number)
    World.add(
      engine.current.world,
      generateRouteWalls(
        scene.current.clientWidth,
        scene.current.clientHeight,
        random_number
      )
    );
    // World.add(engine.current.world, generateRouteWalls(cw, ch, 0));
    World.add(engine.current.world, ball);
  };

  useImperativeHandle(
    ref,
    () => ({
      refAddBall,
    }),
    []
  );

  const refAddBall = (random_number) => {
    if (Composite.get(engine.current.world, 222, "body")) return;
    console.log('adding ball with rand: ', random_number)
    addBall(scene.current.clientWidth / 2, 0, random_number);
  };

  return (
    <div className="w-full h-full">
      <div ref={scene} className="w-full h-full" />
    </div>
  );
});

export default PlinkoGame;
