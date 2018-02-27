from django.urls import path, include
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register(r'bids', views.BidViewSet)
router.register(r'biditems', views.BidItemViewSet, base_name='biditems')
router.register(r'bidtasks', views.BidTaskViewSet, base_name='bidtask')
router.register(r'customers', views.CustomerViewSet)
router.register(r'categories', views.CategoryViewSet, base_name='category')
router.register(r'unittypes', views.UnitTypeViewSet)

bids_router = routers.NestedSimpleRouter(router, r'bids', lookup='bid')
bids_router.register(r'categories', views.CategoryViewSet, base_name='bid-category')
bids_router.register(r'biditems', views.BidItemViewSet, base_name='bid-biditem')
bids_router.register(r'bidtasks', views.BidTaskViewSet, base_name='bid-bidtask')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(bids_router.urls)),
]
