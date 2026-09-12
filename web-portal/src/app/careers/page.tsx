// ============================================
// VERVE AI - Careers Page
// ============================================

'use client'

import * as React from 'react'
import { PublicLayout } from '@/components/public'
import { Card, Button, Badge } from '@/components/ui'
import {
  Briefcase,
  MapPin,
  Clock,
  CurrencyDollar,
  Heart,
  Envelope,
  GraduationCap,
  Code,
  Users,
  ChartLine,
  ArrowRight,
  CheckCircle,
} from '@phosphor-icons/react'

/**
 * Job Card Component
 */
interface JobCardProps {
  title: string
  department: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  department,
  location,
  type,
  salary,
  description,
  requirements,
  benefits
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <Card variant="default" padding="lg" className="mb-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success" size="sm">{department}</Badge>
            <Badge variant="default" size="sm">{type}</Badge>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin size={16} />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <CurrencyDollar size={16} />
              {salary}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
          <p className="text-slate-600 dark:text-slate-400 mb-6">{description}</p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Yêu cầu</h4>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle size={16} className="text-verve-500 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Quyền lợi</h4>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Heart size={16} className="text-verve-500 shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Quan tâm đến vị trí này? Gửi CV của bạn:
            </p>
            <Button variant="primary">
              <Envelope size={18} className="mr-2" />
              Ứng tuyển ngay
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

/**
 * Benefit Card Component
 */
interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  </div>
)

/**
 * Careers Page
 */
export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = React.useState('all')

  const departments = [
    { id: 'all', label: 'Tất cả' },
    { id: 'engineering', label: 'Kỹ thuật' },
    { id: 'product', label: 'Sản phẩm' },
    { id: 'education', label: 'Giáo dục' },
    { id: 'marketing', label: 'Marketing' },
  ]

  const jobs = [
    {
      title: 'Senior Frontend Engineer',
      department: 'Kỹ thuật',
      location: 'TP. Hồ Chí Minh / Remote',
      type: 'Full-time',
      salary: '25 - 40 triệu',
      description: 'Tham gia xây dựng và phát triển giao diện người dùng của nền tảng VERVE AI, làm việc với React, Next.js và các công nghệ hiện đại.',
      requirements: [
        'Tối thiểu 4 năm kinh nghiệm với React/Next.js',
        'Thành thạo TypeScript và Tailwind CSS',
        'Có kinh nghiệm với các thư viện UI và design systems',
        'Hiểu biết về UX/UI design principles',
      ],
      benefits: [
        'Lương cạnh tranh, review 2 lần/năm',
        'Bảo hiểm sức khỏe cao cấp',
        'Flexible working hours, remote work',
        'Đào tạo và phát triển nghề nghiệp',
      ],
      departmentKey: 'engineering',
    },
    {
      title: 'AI/ML Engineer',
      department: 'Kỹ thuật',
      location: 'TP. Hồ Chí Minh',
      type: 'Full-time',
      salary: '30 - 50 triệu',
      description: 'Phát triển và tối ưu các mô hình AI cho hệ thống chẩn đoán học tập, phân tích dữ liệu và tạo câu hỏi tự động.',
      requirements: [
        'Tối thiểu 3 năm kinh nghiệm với Machine Learning',
        'Thành thạo Python, TensorFlow/PyTorch',
        'Có kinh nghiệm với NLP và LLM',
        'Hiểu biết về BKT và educational data mining là điểm cộng',
      ],
      benefits: [
        'Lương top thị trường cho vị trí AI',
        'GPU workstation và cloud credits',
        'Tham gia các conference và workshop',
        'Working with cutting-edge AI technology',
      ],
      departmentKey: 'engineering',
    },
    {
      title: 'Product Manager',
      department: 'Sản phẩm',
      location: 'TP. Hồ Chí Minh',
      type: 'Full-time',
      salary: '25 - 35 triệu',
      description: 'Định hướng và phát triển sản phẩm VERVE AI, làm việc chặt chẽ với đội ngũ kỹ thuật và giáo viên để tạo ra trải nghiệm học tập tốt nhất.',
      requirements: [
        'Tối thiểu 3 năm kinh nghiệm làm PM, ưu tiên EdTech',
        'Kỹ năng phân tích dữ liệu và user research',
        'Khả năng giao tiếp với stakeholders',
        'Hiểu biết về giáo dục và công nghệ giáo dục',
      ],
      benefits: [
        'Quyền tự chủ trong việc định hướng sản phẩm',
        'Equity/stock options',
        'Lộ trình phát triển sự nghiệp rõ ràng',
        'Làm việc với sản phẩm có impact thực sự',
      ],
      departmentKey: 'product',
    },
    {
      title: 'Learning Designer',
      department: 'Giáo dục',
      location: 'TP. Hồ Chí Minh / Hybrid',
      type: 'Full-time',
      salary: '18 - 25 triệu',
      description: 'Thiết kế nội dung học tập và câu hỏi kiểm tra cho nền tảng, đảm bảo chất lượng giáo dục và phù hợp với chương trình GDPT mới.',
      requirements: [
        'Tối thiểu 2 năm kinh nghiệm trong giáo dục hoặc instructional design',
        'Kiến thức vững về chương trình GDPT và đánh giá học sinh',
        'Kỹ năng viết và biên tập nội dung',
        'Ưu tiên ứng viên có kinh nghiệm với AI trong giáo dục',
      ],
      benefits: [
        'Môi trường làm việc sáng tạo',
        'Đào tạo về công nghệ AI trong giáo dục',
        'Cơ hội ảnh hưởng đến chất lượng giáo dục',
        'Flexible hours và work from home',
      ],
      departmentKey: 'education',
    },
    {
      title: 'Marketing Executive',
      department: 'Marketing',
      location: 'TP. Hồ Chí Minh',
      type: 'Full-time',
      salary: '12 - 18 triệu',
      description: 'Xây dựng và thực hiện các chiến dịch marketing để tiếp cận giáo viên và trường học, xây dựng thương hiệu VERVE AI trong cộng đồng EdTech.',
      requirements: [
        'Tối thiểu 2 năm kinh nghiệm marketing, ưu tiên B2B',
        'Kinh nghiệm với content marketing và social media',
        'Khả năng phân tích data và đo lường hiệu quả',
        'Hiểu biết về ngành giáo dục là điểm cộng',
      ],
      benefits: [
        'Cơ hội thăng tiến nhanh',
        'Marketing budget để thử nghiệm ý tưởng',
        'Làm việc với brand có tầm ảnh hưởng',
        'Team building và company trips',
      ],
      departmentKey: 'marketing',
    },
  ]

  const filteredJobs = selectedDepartment === 'all'
    ? jobs
    : jobs.filter(job => job.departmentKey === selectedDepartment)

  return (
    <PublicLayout>
      <div className="container-verve py-12 lg:py-16">
        {/* hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-3 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
            <Briefcase size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Gia nhập VERVE AI
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Cùng chúng tôi xây dựng tương lai giáo dục thông minh. Chúng tôi tìm kiếm những người đam mê công nghệ
            và muốn tạo ra tác động tích cực đến giáo dục.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Tại sao chọn VERVE AI?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon={<ChartLine size={24} />}
              title="Tăng trưởng nhanh"
              description="Cơ hội phát triển sự nghiệp trong môi trường startup năng động, quy mô đang mở rộng."
            />
            <BenefitCard
              icon={<GraduationCap size={24} />}
              title="Đào tạo liên tục"
              description="Ngân sách học tập hàng năm, tham gia conference và workshop để nâng cao kỹ năng."
            />
            <BenefitCard
              icon={<Users size={24} />}
              title="Team tuyệt vời"
              description="Làm việc với những người giỏi nhất từ các công ty hàng đầu trong và ngoài nước."
            />
            <BenefitCard
              icon={<Heart size={24} />}
              title="Phúc lợi đầy đủ"
              description="Bảo hiểm sức khỏe, bảo hiểm tai nạn, laptop, phone allowance và nhiều hơn nữa."
            />
            <BenefitCard
              icon={<Code size={24} />}
              title="Công nghệ hiện đại"
              description="Làm việc với các công nghệ mới nhất: AI, LLM, Next.js, Tailwind và cloud infrastructure."
            />
            <BenefitCard
              icon={<Briefcase size={24} />}
              title="Impact thực sự"
              description="Công việc của bạn trực tiếp giúp hàng nghìn giáo viên và học sinh cải thiện chất lượng học tập."
            />
          </div>
        </div>

        {/* Jobs Section */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Vị trí đang tuyển dụng
            </h2>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedDepartment === dept.id
                      ? 'bg-verve-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            {filteredJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card variant="default" padding="lg" className="text-center">
              <p className="text-slate-500 dark:text-slate-400">
                Hiện không có vị trí phù hợp với bộ lọc đã chọn. Thử chọn bộ lọc khác hoặc quay lại sau.
              </p>
            </Card>
          )}
        </div>

        {/* Open Application */}
        <Card variant="default" padding="lg" className="mt-12 bg-verve-50 dark:bg-verve-900/20 border-verve-200 dark:border-verve-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Không tìm thấy vị trí phù hợp?
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Gửi CV của bạn và chúng tôi sẽ liên hệ khi có vị trí phù hợp.
            </p>
            <Button variant="primary" className="mt-4">
              <Envelope size={18} className="mr-2" />
              Gửi CV ứng tuyển
            </Button>
          </div>
        </Card>
      </div>
    </PublicLayout>
  )
}
