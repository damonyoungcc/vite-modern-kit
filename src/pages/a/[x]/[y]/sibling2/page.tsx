export default function Sibling2Page({ params }: { params: { x: string; y: string } }) {
  return <h1>Sibling2 Page for X: {params.x}, Y: {params.y}</h1>;
}
