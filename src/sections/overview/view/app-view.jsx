import React, { useState, useEffect, useCallback } from 'react';
import { getReport, getChartData } from 'src/services/apiService';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ReportChart from '../report-chart';
import AppWidgetSummary from '../app-widget-summary';
import DateRangePicker from '../DateRangePicker';

export default function AppView() {
  const [loadingReport, setLoadingReport] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [reportData, setReportData] = useState({ total_income: 0, total_expense: 0 });
  const [chartData, setChartData] = useState({ labels: [], data: { incomes: [], expenses: [] } });
  const [dateRange, setDateRange] = useState(['2020-01-01', '2050-12-31']);
  const [chartDataFetched, setChartDataFetched] = useState(false);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      setLoadingReport(true);
      const [from_date, to_date] = dateRange;

      try {
        const reportResponse = await getReport(from_date, to_date);
        setReportData({
          total_income: parseFloat(reportResponse.total_income),
          total_expense: parseFloat(reportResponse.total_expense),
        });
      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setLoadingReport(false);
      }
    };

    fetchReportData();
  }, [dateRange]);

  // Fetch chart data only if not already fetched
  const fetchChartData = useCallback(async () => {
    setLoadingChart(true);
    const [from_date, to_date] = dateRange;

    try {
      const chartResponse = await getChartData(from_date, to_date);
      setChartData({
        labels: chartResponse.labels,
        data: {
          incomes: chartResponse.data.incomes.map(value => parseFloat(value)),
          expenses: chartResponse.data.expenses.map(value => parseFloat(value))
        }
      });
      setChartDataFetched(true);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoadingChart(false);
    }
  }, [dateRange]);

  useEffect(() => {
    if (!chartDataFetched) {
      fetchChartData();
    }
  }, [fetchChartData, chartDataFetched]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 3,
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: 200, // Set the width you desire
          }}
        >
          <DateRangePicker onDateRangeChange={setDateRange} />
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={6}>
          {loadingReport ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <AppWidgetSummary
              title="Income"
              total={reportData.total_income}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          )}
        </Grid>

        <Grid xs={12} sm={6} md={6}>
          {loadingReport ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <AppWidgetSummary
              title="Expense"
              total={reportData.total_expense}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
            />
          )}
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          {loadingChart ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={200}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading...
            </Typography>
          </Box>
          ) : (
            <ReportChart
              title="Cash flow"
              subheader="This Year"
              chart={{
                labels: chartData.labels,
                series: [
                  {
                    name: 'Income',
                    type: 'area',
                    fill: 'gradient',
                    data: chartData.data.incomes,
                  },
                  {
                    name: 'Expense',
                    type: 'line',
                    fill: 'solid',
                    data: chartData.data.expenses,
                  },
                ],
              }}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
