import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidChartProps {
	chart: string
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
	const containerRef = useRef<HTMLDivElement>(null)

	const [retry, setRetry] = useState(0)

	useEffect(() => {
		// Initialize mermaid
		mermaid.initialize({ startOnLoad: false })

		// Give CodeSandbox some time to initialize
		const timer = setTimeout(() => {
			if (containerRef.current) {
				mermaid
					.render('mermaid-chart', chart)
					.then(({ svg }) => {
						if (containerRef.current) {
							containerRef.current.innerHTML = svg
						}
					})
					.catch(() => {
						// If rendering fails, try again
						setRetry((r) => r + 1)
					})
			}
		}, 200)

		return () => clearTimeout(timer)
	}, [chart, retry])

	return (
		<>
			<div ref={containerRef} className="overflow-x-auto" />
		</>
	)
}

export default MermaidChart
