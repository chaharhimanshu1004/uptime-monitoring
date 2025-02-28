export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced floating shapes with more organic movement */}
      <div className="absolute top-20 left-[15%] w-64 h-64 rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-cyan-500/5 blur-2xl animate-[spin_20s_linear_infinite]" />
      </div>
      <div className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 blur-3xl animate-[float_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-fuchsia-500/5 blur-2xl animate-[spin_25s_linear_infinite]" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
    </div>
  )
}

