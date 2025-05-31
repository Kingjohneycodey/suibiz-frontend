
export const Stats = () => {
  const stats = [
    { label: "Active Users", value: "12.5K+" },
    { label: "Transactions", value: "45.2K+" },
    { label: "Total Volume", value: "$2.8M+" },
    { label: "Countries", value: "89+" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-purple-100 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
