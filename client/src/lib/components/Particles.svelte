<script lang="ts">
	import Particles from 'svelte-particles';
	import type { Engine, ISourceOptions } from 'tsparticles-engine';

	import { loadSlim } from 'tsparticles-slim';

	let particlesConfig: ISourceOptions = {
		particles: {
			move: {
				enable: true,
				speed: { min: 1, max: 4 },
				outMode: 'bounce'
			},

			rotate: {
				animation: {
					enable: true,

					speed: { min: 10, max: 15 }
				}
			},

			number: {
				value: 20
			},

			shape: {
				images: [
					{
						src: 'ln.svg'
					},
					{
						src: 'note.svg'
					},
					{
						src: 'bitcoin-simple.png'
					}
				],
				type: 'image'
			},
			size: {
				value: {
					min: 24,
					max: 38
				}
			}
		}
	};

	const particlesInit = async (engine: Engine) => {
		await loadSlim(engine);
	};
</script>

<Particles id="tsparticles" class="foo bar" style="" options={particlesConfig} {particlesInit} />
