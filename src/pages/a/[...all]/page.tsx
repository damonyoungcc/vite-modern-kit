export default function CatchAllAPage({ params }: { params: { all: string[] } }) {
  return <h1>Catch-All Page for A: {params.all.join('/')}</h1>;
}
