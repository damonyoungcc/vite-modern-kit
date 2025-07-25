export default function CatchAllXPage({ params }: { params: { all: string[] } }) {
  return <h1>Catch-All Page for X: {params.all.join('/')}</h1>;
}
