// docxBuilder.js

const docx = require('docx');
const fs = require('fs');
const tmp = require('tmp-promise');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400; // Width of the chart
const height = 300; // Height of the chart

async function generateRiskChart(riskCounts) {
  const chartCallback = (ChartJS) => {
    ChartJS.register(require('chartjs-plugin-datalabels'));
  };

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

  const configuration = {
    type: 'bar',
    data: {
      labels: ['High', 'Medium', 'Low'],
      datasets: [
        {
          label: 'Risk Count',
          data: [riskCounts.high, riskCounts.medium, riskCounts.low],
          backgroundColor: ['#d73058', '#f8bb26', '#0dbb37'],
        },
      ],
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        datalabels: {
          color: 'white',
          anchor: 'end',
          align: 'end',
          clamp: 'true',
          offset: -20,
          font: {
            size: 16
          },
          formatter: (value) => value,
          display: function (context) {
            return context.dataset.data[context.dataIndex] > 0;
          },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          ticks: {
            color: '#2B93FF',
            font: {
                size: 16
            }
          },
          grid: {
            display: false,
          },
        },
      },
    },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

  return imageBuffer;
}

// Function to get the ordinal suffix for the day
function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function getPublicationDate() {
    const today = new Date();
    const day = today.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    const monthIndex = today.getMonth();
    const year = today.getFullYear();
    const formattedDate = `${day}${getOrdinalSuffix(day)} ${monthNames[monthIndex]} ${year}`;
    return formattedDate;
}

function getPublicationYear() {
    const today = new Date();
    const year = today.getFullYear();
    const formattedDate = `${year}`;
    return formattedDate;
}

async function getImage(riskCounts) {
    const myChart = new ChartJsImage();
    myChart.setConfig({
        type: 'doughnut',
        data: {
            labels: Object.keys(riskCounts),
            datasets: [{
                label: 'Risk count',
                data: Object.values(riskCounts),
                backgroundColor: [
                    'rgba(200, 200, 200, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(54, 162, 235, 0.5)'

                ],
                borderColor: [
                    'rgba(200, 200, 200, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            aspectRatio: 2,
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: false,
                    text: 'Risk Counts'
                }
            }
        }
    });
    const buf = await myChart.toBinary();
    return buf;
}

async function buildDocx(project,metrics,owner) {
    //const chartData = await getImage(metrics.riskCounts);
    try {
        const { path: tempFilePath } = await tmp.file()
        const topRisks = Array.isArray(metrics.topRisks) ? metrics.topRisks : [];
        const sortedRisks = Array.isArray(metrics.sortedRisks) ? metrics.sortedRisks : [];
        const imageBuffer = await generateRiskChart(metrics.riskCounts);

        const doc = await docx.patchDocument(fs.readFileSync("./data/template.docx"), {
            outputType: "nodebuffer",
            features: {
                updateFields: true,
            },
            patches: {
                doctitle: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun( {
                            text: project.dataset_name,
                            size: 60
                        })
                    ]
                },
                title: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun(project.dataset_name)
                    ]
                },
                author: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun(owner.name + " (" + owner.email + ")")
                    ]
                },
                footertitle: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun(project.dataset_name)
                    ]
                },
                date: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun( {
                            text: getPublicationDate(),
                        })
                    ]
                },
                footerdate: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun( {
                            text: getPublicationYear(),
                        })
                    ]
                },
                dataset_name: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun(project.dataset_name)
                    ]
                },
                dataset_description: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun(project.dataset_description)
                    ]
                },
                sharing_reason: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun(project.sharing_reason)
                    ]
                },
                sharing_reason_details: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.TextRun(project.sharing_reason_details)
                    ]
                },
                chart: {
                    type: docx.PatchType.PARAGRAPH,
                    children: [
                        new docx.ImageRun({ data: imageBuffer, transformation: { width: 400, height: 300 } })
                    ]
                },
                topRisks: {
                    type: docx.PatchType.DOCUMENT,
                    children: [
                        new docx.Table({
                            columns: 2,
                            width: 0,
                            columnWidths: [5638,2000,2000], // total page width is 9638 DXA for A4 portrait
                            rows: [
                                new docx.TableRow({
                                    children: [
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Risk')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Liklihood')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Impact')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        })
                                    ]
                                }),
                                ...topRisks.map(risk =>
                                    new docx.TableRow({
                                        children: [
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.risk)],
                                            }),
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.likelihood)],
                                            }),
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.impact)],
                                            })
                                        ]
                                    })
                                )
                            ]
                        })
                    ]
                },
                risks: {
                    type: docx.PatchType.DOCUMENT,
                    children: [
                        new docx.Table({
                            columns: 6,
                            width: 0,
                            columnWidths: [3200,1606,1606,1606,1606,4800], // total page width is 9638 DXA for A4 portrait
                            rows: [
                                new docx.TableRow({
                                    children: [
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Risk')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Impact')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Likelihood')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Role')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        }),
                                        new docx.TableCell({
                                            children: [new docx.Paragraph('Action')],
                                            shading: {
                                                fill: "5E95F8",
                                                color: "ffffff"
                                            }
                                        })
                                    ]
                                }),
                                ...sortedRisks.map(risk =>
                                    new docx.TableRow({
                                        children: [
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.risk)],
                                            }),
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.impact)],
                                            }),
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.likelihood)],
                                            }),
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.actionType)],
                                            }),
                                            new docx.TableCell({
                                                children: [new docx.Paragraph(risk.mitigatingActions)],
                                            })
                                        ]
                                    })
                                )
                            ]
                        })
                    ]
                },
                assessment_detail: {
                    type: docx.PatchType.DOCUMENT,
                    children: generateAssessmentDetail(project.answers)
                }
            }
        });

        // Write the patched document to the temporary file
        fs.writeFileSync(tempFilePath, doc);

        return tempFilePath;
    } catch (err) {
        console.log("Error creating docx:", err);
        throw err; // Rethrow the error to be handled elsewhere
    }
}
function generateAssessmentDetail(answers) {
    const groupedByCategory = answers.reduce((acc, answer) => {
      if (!acc[answer.category]) acc[answer.category] = [];
      acc[answer.category].push(answer);
      return acc;
    }, {});

    const categories = Object.keys(groupedByCategory).map(category => {
      const questions = groupedByCategory[category].map(answer => {
        const risks = answer.risks || [];
        const considerations = answer.considerations;
        return [
          new docx.Paragraph({
            text: `Checkpoint ${answer.checkpoint}: ${answer.question}`,
            heading: docx.HeadingLevel.HEADING_3,
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({ // This ensures the padding is enforced at the end
                   text: ':  ',
              }),
              new docx.TextRun({
                text: 'Answer: '
              }),
              new docx.TextRun({
                text: `   ${answer.answer}   `,
                highlight: getRiskLevelHighlight(answer.risk_level),
              }),
              new docx.TextRun({ // This ensures the padding is enforced at the end
                text: '  :',
              }),
            ],
          }),
          ...generateConsiderationsTable(considerations),
          ...risks.length > 0 ? [
            new docx.Paragraph({
              text: `Identified Risks`,
              heading: docx.HeadingLevel.HEADING_4,
            }),
            ...risks.flatMap(risk => [
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: `${risk.risk}`,
                            bold: true,
                            size: 28
                        })
                    ]
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({ // This ensures the padding is enforced at the end
                        text: ':  ',
                    }),
                    new docx.TextRun({
                      text: 'Impact: ',
                      bold: true,
                    }),
                    new docx.TextRun({
                      text: '  ' + risk.impact + '  ', // works
                      highlight: getRiskLevelHighlight(risk.impact.toLowerCase()),
                    }),
                    new docx.TextRun({
                      text: '     Likelihood: ',
                      bold: true,
                    }),
                    new docx.TextRun({
                      text: '  ' + risk.likelihood + '  ', // works
                      highlight: getRiskLevelHighlight(risk.likelihood.toLowerCase()),
                    }),
                    new docx.TextRun({
                      text: '     Action Type: ',
                      bold: true,
                    }),
                    new docx.TextRun({
                      text: '  ' + risk.actionType + '  ',
                      highlight: 'blue',
                    }),
                    new docx.TextRun({ // This ensures the padding is enforced at the end
                        text: '  :',
                    }),
                  ],
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: 'Mitigating Actions: ',
                      bold: true,
                    }),
                    new docx.TextRun({
                      text: risk.mitigatingActions,
                    }),
                  ],
                }),
              ]),
          ] : []
        ];
      }).flat();

      return [
        new docx.Paragraph({
          text: `Category: ${category}`,
          heading: docx.HeadingLevel.HEADING_2,
        }),
        ...questions
      ];
    }).flat();

    return categories;
}

function generateConsiderationsTable(considerations) {
    if (!considerations.length > 0) {
        return [];
    }

    const rows = [
        new docx.TableRow({
            children: [
                new docx.TableCell({
                    children: [new docx.Paragraph({
                        text: "Consideration",
                        bold: true,
                    })],
                    shading: {
                        fill: "5E95F8", // Light grey background for header
                    },
                }),
                new docx.TableCell({
                    children: [new docx.Paragraph({
                        text: "Considered",
                        bold: true,
                    })],
                    shading: {
                        fill: "5E95F8", // Light grey background for header
                    },
                }),
            ],
        }),
        ...considerations.map((consideration) =>
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        children: [new docx.Paragraph(consideration.text)],
                    }),
                    new docx.TableCell({
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: consideration.answer ? "✔" : "✘", // Tick for true, cross for false
                                        bold: true,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            })
        ),
    ];

    return [
        new docx.Paragraph({
            text: "Considerations checklist",
            heading: docx.HeadingLevel.HEADING_4,
        }),
        new docx.Table({
            rows: rows,
            width: {
                size: 100,
                type: docx.WidthType.PERCENTAGE,
            },
        }),
    ];
}


function getRiskLevelHighlight(riskLevel) {
    switch (riskLevel.toLowerCase()) {
      case 'red':
      case 'high':
        return 'red';
      case 'amber':
      case 'medium':
        return 'yellow';
      case 'green':
      case 'low':
        return 'green';
      default:
        return 'none';
    }
}

module.exports = { buildDocx };