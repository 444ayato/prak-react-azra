import Card from "./Card";

export default function FeatureSection({ tag, title, features = [] }) {
  return (
    <div className="py-6">
      {/* Header Section */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
          {tag}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mt-3">
          {title}
        </h2>
      </div>

      {/* Grid Box Fitur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}