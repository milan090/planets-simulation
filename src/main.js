import {
  Bodies,
  Engine,
  Render,
  Runner,
  World,
  use,
  Mouse,
  MouseConstraint,
  Common,
  Body,
  Events,
  Vector,
} from "matter-js";
import * as MatterAttractors from "matter-attractors";
import "./main.scss";
import { randomNumber } from "./utils/randomNum";

const engine = Engine.create();

const screen = { height: window.innerHeight, width: window.innerWidth };

const canvas = document.getElementById("canvas");
const render = Render.create({
  engine,
  canvas,
  options: {
    wireframes: false,
    height: screen.height,
    width: screen.width,
  },
});
const runner = Runner.create();

// World Configs
const { world } = engine;
world.gravity.scale = 0;

// engine.timing.timeScale = 1.5;

// Gravity
const G = 6.67e-3;

const gravityFunction = function (bodyA, bodyB) {
  // use Newton's law of gravitation
  const bToA = Vector.sub(bodyB.position, bodyA.position),
    distanceSq = Vector.magnitudeSquared(bToA) || 0.0001,
    normal = Vector.normalise(bToA),
    magnitude = -G * ((bodyA.mass * bodyB.mass) / distanceSq),
    force = Vector.mult(normal, magnitude);

  // to apply forces to both bodies
  Body.applyForce(bodyA, bodyA.position, Vector.neg(force));
  Body.applyForce(bodyB, bodyB.position, force);
};

// Adding bodies

const sun = Bodies.circle(screen.width / 2, screen.height / 2, 20, {
  isStatic: true,
  mass: 50,
  render: {
    fillStyle: "yellow",
  },
  plugin: {
    attractors: [gravityFunction],
  },
});

World.add(world, sun);

for (let i = 0; i < 200; i++) {
  const mass = randomNumber(1, 5);
  const body = Bodies.circle(
    randomNumber(0, screen.width),
    randomNumber(0, screen.height),

    mass, // arbitary
    {
      mass: mass,
      frictionAir: 0,
      friction: 0,
      plugin: {
        attractors: [gravityFunction],
      },
    }
  );

  Body.setVelocity(body, { x: Common.random(-1, 1), y: Common.random(-1, 1) });

  World.add(world, body);
}

// Mouse
const mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

// Events.on(engine, "afterUpdate", function () {
//   if (!mouse.position.x) {
//     return;
//   }

//   // smoothly move the attractor body towards the mouse
//   Body.translate(sun, {
//     x: (mouse.position.x - sun.position.x) * 0.25,
//     y: (mouse.position.y - sun.position.y) * 0.25,
//   });
// });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

Engine.run(engine);
Render.run(render);
Runner.run(runner, engine);

// https://github.com/liabru/matter-attractors
use("matter-attractors");
