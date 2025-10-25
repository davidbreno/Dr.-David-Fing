export const metadata = { title: "Figma Export" };
export default function Figma() {
  return (
    <div className="min-h-[80vh]">
      <div className="glass rounded-2xl p-2">
        <iframe
          src="/figma/index.html"
          className="w-full h-[80vh] rounded-xl bg-black/20"
          title="Figma Export"
        />
      </div>
      <p className="mt-2 text-xs opacity-70">
        Este iframe carrega seu export do plugin. Vamos migrar para componentes aos poucos.
      </p>
    </div>
  );
}
